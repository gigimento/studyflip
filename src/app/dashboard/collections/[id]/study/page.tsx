'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Card = { id: string; question: string; answer: string };

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    fetch(`/api/collections/${id}/cards`, { headers: { 'x-session-id': sessionId || '' } })
      .then(r => r.ok ? r.json() : [])
      .then(setCards);
  }, [id]);

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
        onClick={() => setFlipped(!flipped)}
        className="bg-[#1e1d24] rounded-2xl p-8 min-h-[250px] flex items-center justify-center cursor-pointer select-none mb-6 border border-[#8BA5BE]/10 hover:border-[#E19C63]/50 transition-all"
      >
        {!flipped ? (
          <p className="text-xl font-semibold text-center">{card.question}</p>
        ) : (
          <p className="text-lg text-center text-[#8BA5BE]">{card.answer}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => { setFlipped(false); setIndex(Math.max(0, index - 1)); }}
          disabled={index === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => { setFlipped(false); setIndex(Math.min(cards.length - 1, index + 1)); }}
          disabled={index === cards.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
