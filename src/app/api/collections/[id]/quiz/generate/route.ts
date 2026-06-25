import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { generateQuizQuestions } from '@/lib/gemini';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: collection } = await supabase.from('sf_collections').select('id').eq('id', id).eq('user_id', session.user_id).single();
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: cards } = await supabase.from('sf_flashcards').select('id, question, answer').eq('collection_id', id);
  if (!cards || cards.length === 0) return NextResponse.json({ error: 'No cards in collection' }, { status: 400 });

  try {
    const questions = await generateQuizQuestions(cards.map(c => ({ question: c.question, answer: c.answer })));
    await supabase.from('sf_quiz_questions').delete().eq('collection_id', id);
    const rows = questions.map((q, i) => ({
      id: crypto.randomUUID(),
      collection_id: id,
      flashcard_id: cards[i % cards.length].id,
      question: q.question,
      options: JSON.stringify(q.options),
      correct_index: q.correctIndex,
    }));
    const { error: insError } = await supabase.from('sf_quiz_questions').insert(rows);
    if (insError) throw new Error(insError.message);
    return NextResponse.json({ questions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
