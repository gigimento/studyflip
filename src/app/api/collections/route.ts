import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const collections = db.prepare('SELECT c.*, (SELECT COUNT(*) FROM flashcards WHERE collection_id = c.id) as card_count FROM collections c WHERE c.user_id = ? ORDER BY c.created_at DESC').all(session.user_id);
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, subject } = await req.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO collections (id, user_id, title, subject) VALUES (?, ?, ?, ?)').run(id, session.user_id, title, subject || '');
  return NextResponse.json({ id, title, subject });
}
