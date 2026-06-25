import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const cards = db.prepare('SELECT id, question, answer FROM flashcards WHERE collection_id = ? ORDER BY created_at').all(id);
  return NextResponse.json(cards);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { cards } = await req.json();
  const collection = db.prepare('SELECT * FROM collections WHERE id = ? AND user_id = ?').get(id, session.user_id);
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const insert = db.prepare('INSERT INTO flashcards (id, collection_id, question, answer) VALUES (?, ?, ?, ?)');
  const del = db.prepare('DELETE FROM flashcards WHERE collection_id = ?');
  const txn = db.transaction(() => {
    del.run(id);
    for (const card of cards) {
      insert.run(crypto.randomUUID(), id, card.question, card.answer);
    }
  });
  txn();

  const updated = db.prepare('SELECT id, question, answer FROM flashcards WHERE collection_id = ? ORDER BY created_at').all(id);
  return NextResponse.json(updated);
}
