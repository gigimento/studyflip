import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: col } = await supabase.from('sf_collections').select('id, title').eq('share_token', token).single();
  if (!col) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: cards } = await supabase.from('sf_flashcards').select('question, answer').eq('collection_id', col.id).order('created_at');
  return NextResponse.json({ title: col.title, cards: cards ?? [] });
}
