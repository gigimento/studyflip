export interface ReviewState {
  easiness: number;
  intervalDays: number;
  repetitions: number;
  nextReview: string;
}

export function calculateNextReview(quality: number, state?: Partial<ReviewState>): ReviewState {
  const ef = state?.easiness ?? 2.5;
  const interval = state?.intervalDays ?? 0;
  const reps = state?.repetitions ?? 0;

  let newEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEf < 1.3) newEf = 1.3;

  let newInterval: number;
  let newReps: number;

  if (quality >= 3) {
    if (reps === 0) newInterval = 1;
    else if (reps === 1) newInterval = 6;
    else newInterval = Math.round(interval * ef);
    newReps = reps + 1;
  } else {
    newReps = 0;
    newInterval = 1;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  const nextReview = nextDate.toISOString().split('T')[0];

  return { easiness: newEf, intervalDays: newInterval, repetitions: newReps, nextReview };
}
