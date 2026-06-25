import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { calculateNextReview } from '@/lib/spaced-repetition';

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id');
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { cardId, quality } = await req.json();
  if (!cardId || quality === undefined) {
    return NextResponse.json({ error: 'cardId and quality required' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('sf_review_log')
    .select('*')
    .eq('flashcard_id', cardId)
    .eq('user_id', session.user_id)
    .single();

  const state = existing
    ? { easiness: existing.easiness, intervalDays: existing.interval_days, repetitions: existing.repetitions }
    : undefined;

  const next = calculateNextReview(quality, state);

  if (existing) {
    await supabase.from('sf_review_log').update({
      easiness: next.easiness,
      interval_days: next.intervalDays,
      repetitions: next.repetitions,
      next_review: next.nextReview,
      last_reviewed: new Date().toISOString(),
    }).eq('id', existing.id);
  } else {
    await supabase.from('sf_review_log').insert({
      id: crypto.randomUUID(),
      flashcard_id: cardId,
      user_id: session.user_id,
      easiness: next.easiness,
      interval_days: next.intervalDays,
      repetitions: next.repetitions,
      next_review: next.nextReview,
    });
  }

  return NextResponse.json({ nextReview: next.nextReview });
}
