import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: questions } = await supabase.from('sf_quiz_questions').select('id, question, options, correct_index').eq('collection_id', id).order('created_at');
  return NextResponse.json((questions ?? []).map(q => ({ ...q, options: q.options })));
}
