import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: cards } = await supabase.from('sf_flashcards').select('id, question, answer').eq('collection_id', id).order('created_at');
  return NextResponse.json(cards ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: collection } = await supabase.from('sf_collections').select('id').eq('id', id).eq('user_id', session.user_id).single();
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { cards } = await req.json();

  const { error: delError } = await supabase.from('sf_flashcards').delete().eq('collection_id', id);
  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });

  const rows = cards.map((card: any) => ({ id: crypto.randomUUID(), collection_id: id, question: card.question, answer: card.answer }));
  const { error: insError } = await supabase.from('sf_flashcards').insert(rows);
  if (insError) return NextResponse.json({ error: insError.message }, { status: 500 });

  const { data: updated } = await supabase.from('sf_flashcards').select('id, question, answer').eq('collection_id', id).order('created_at');
  return NextResponse.json(updated ?? []);
}
