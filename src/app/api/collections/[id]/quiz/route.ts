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
  const questions = db.prepare('SELECT id, question, options, correct_index FROM quiz_questions WHERE collection_id = ? ORDER BY created_at').all(id) as any[];
  return NextResponse.json(questions.map(q => ({ ...q, options: JSON.parse(q.options) })));
}
