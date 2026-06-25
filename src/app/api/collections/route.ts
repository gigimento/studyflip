import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: collections } = await supabase
    .from('sf_collections')
    .select('*, sf_flashcards:sf_flashcards(count)')
    .eq('user_id', session.user_id)
    .order('created_at', { ascending: false });

  const mapped = collections?.map(c => ({
    ...c,
    card_count: c.sf_flashcards?.[0]?.count ?? 0,
    sf_flashcards: undefined,
  })) ?? [];

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, subject } = await req.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const id = crypto.randomUUID();
  const { error } = await supabase.from('sf_collections').insert({ id, user_id: session.user_id, title, subject: subject || '' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id, title, subject });
}
