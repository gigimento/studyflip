import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('sf_review_log')
    .select('flashcard_id, sf_flashcards!inner(id, question, answer, collection_id, sf_collections!inner(title, subject))')
    .eq('user_id', session.user_id)
    .lte('next_review', today);

  const due = (data ?? []).map((r: any) => ({
    id: r.flashcard_id,
    question: r.sf_flashcards.question,
    answer: r.sf_flashcards.answer,
    collectionId: r.sf_flashcards.collection_id,
    collectionTitle: r.sf_flashcards.sf_collections.title,
    collectionSubject: r.sf_flashcards.sf_collections.subject,
  }));

  return NextResponse.json(due);
}
