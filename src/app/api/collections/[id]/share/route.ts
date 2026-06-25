import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: col } = await supabase.from('sf_collections').select('id').eq('id', id).eq('user_id', session.user_id).single();
  if (!col) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const token = crypto.randomUUID().slice(0, 8);
  await supabase.from('sf_collections').update({ share_token: token }).eq('id', id);
  return NextResponse.json({ token, url: `/shared/${token}` });
}
