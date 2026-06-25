import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { generateFlashcards } from '@/lib/gemini';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: collection } = await supabase.from('sf_collections').select('id').eq('id', id).eq('user_id', session.user_id).single();
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 });

  try {
    const cards = await generateFlashcards(text);
    return NextResponse.json({ cards });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
