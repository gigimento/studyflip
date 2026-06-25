'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Card = { id: string; question: string; answer: string };

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

  useEffect(() => {
    fetch(`/api/collections/${id}/cards`, { headers: { 'x-session-id': sessionId || '' } })
      .then(r => r.ok ? r.json() : [])
      .then(setCards);
  }, [id, sessionId]);

  const submitReview = useCallback(async (quality: number) => {
    const card = cards[index];
    if (!card) return;
    await fetch('/api/cards/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ cardId: card.id, quality }),
    });
    setReviewed(true);
  }, [cards, index, sessionId]);

  function nextCard() {
    if (index < cards.length - 1) {
      setIndex(i => i + 1);
      setFlipped(false);
      setReviewed(false);
    }
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8BA5BE] mb-4">No cards in this collection.</p>
        <Button onClick={() => router.push(`/dashboard/collections/${id}`)}>Add Cards</Button>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push(`/dashboard/collections/${id}`)} className="text-[#8BA5BE] hover:text-white cursor-pointer">&larr; Back</button>
        <span className="text-[#8BA5BE] text-sm">{index + 1} / {cards.length}</span>
      </div>

      <div
        onClick={() => { if (!flipped) setFlipped(true); }}
        className="bg-[#1e1d24] rounded-2xl p-8 min-h-[250px] flex items-center justify-center cursor-pointer select-none mb-6 border border-[#8BA5BE]/10 hover:border-[#E19C63]/50 transition-all"
      >
        {!flipped ? (
          <p className="text-xl font-semibold text-center">{card.question}</p>
        ) : (
          <p className="text-lg text-center text-[#8BA5BE]">{card.answer}</p>
        )}
      </div>

      {flipped && !reviewed && (
        <div className="flex gap-3 mb-4">
          <Button variant="secondary" onClick={() => submitReview(1)} className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/30">
            Didn't Know
          </Button>
          <Button onClick={() => submitReview(4)} className="flex-1 bg-green-900/40 hover:bg-green-900/60 text-green-300 border border-green-500/30">
            Knew It
          </Button>
        </div>
      )}

      {reviewed && (
        <Button onClick={nextCard} className="w-full mb-4">
          {index < cards.length - 1 ? 'Next Card' : 'Finished'}
        </Button>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => { setFlipped(false); setReviewed(false); setIndex(Math.max(0, index - 1)); }} disabled={index === 0}>
          Previous
        </Button>
      </div>
    </div>
  );
}
