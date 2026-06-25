import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { generateQuizQuestions } from '@/lib/gemini';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const collection = db.prepare('SELECT * FROM collections WHERE id = ? AND user_id = ?').get(id, session.user_id);
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const cards = db.prepare('SELECT question, answer FROM flashcards WHERE collection_id = ?').all(id) as any[];
  if (cards.length === 0) return NextResponse.json({ error: 'No cards in collection' }, { status: 400 });

  try {
    const questions = await generateQuizQuestions(cards);
    const insert = db.prepare('INSERT INTO quiz_questions (id, collection_id, flashcard_id, question, options, correct_index) VALUES (?, ?, ?, ?, ?, ?)');
    const del = db.prepare('DELETE FROM quiz_questions WHERE collection_id = ?');
    const txn = db.transaction(() => {
      del.run(id);
      for (const q of questions) {
        insert.run(crypto.randomUUID(), id, cards[0].id, q.question, JSON.stringify(q.options), q.correctIndex);
      }
    });
    txn();
    return NextResponse.json({ questions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
