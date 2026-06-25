import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const collection = db.prepare('SELECT * FROM collections WHERE id = ? AND user_id = ?').get(id, session.user_id);
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare('DELETE FROM collections WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
