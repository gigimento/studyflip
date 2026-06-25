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
        <p className="text-[#777777] mb-4">No cards in this collection.</p>
        <Button onClick={() => router.push(`/dashboard/collections/${id}`)}>Add Cards</Button>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push(`/dashboard/collections/${id}`)} className="text-[#777777] font-bold hover:text-[#3c3c3c] cursor-pointer">&larr; Back</button>
        <div className="flex items-center gap-2">
          <div className="bg-[#dbf8c5] text-[#58a700] text-sm font-bold px-3 py-1 rounded-full">{index + 1} / {cards.length}</div>
        </div>
      </div>

      <div
        onClick={() => { if (!flipped) setFlipped(true); }}
        className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-8 min-h-[250px] flex items-center justify-center cursor-pointer select-none mb-6 hover:border-[#58cc02] transition-all"
      >
        {!flipped ? (
          <p className="text-xl font-bold text-center text-[#3c3c3c]">{card.question}</p>
        ) : (
          <p className="text-lg text-center text-[#777777]">{card.answer}</p>
        )}
      </div>

      {flipped && !reviewed && (
        <div className="flex gap-3 mb-4">
          <Button variant="danger" onClick={() => submitReview(1)} className="flex-1">
            Didn't Know
          </Button>
          <Button onClick={() => submitReview(4)} className="flex-1">
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
