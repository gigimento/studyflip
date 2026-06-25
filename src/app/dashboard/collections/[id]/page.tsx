'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Card = { id?: string; question: string; answer: string };

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [text, setText] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    fetch(`/api/collections/${id}/cards`, { headers: { 'x-session-id': sessionId || '' } })
      .then(r => r.ok ? r.json() : [])
      .then(setCards);
  }, [id]);

  async function generateCards() {
    if (!text.trim()) return;
    setLoading(true);
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch(`/api/collections/${id}/cards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (data.cards) setCards(data.cards);
    setLoading(false);
  }

  async function saveCards() {
    const sessionId = localStorage.getItem('sessionId');
    await fetch(`/api/collections/${id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ cards }),
    });
  }

  function updateCard(index: number, field: 'question' | 'answer', value: string) {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  }

  return (
    <div>
      <div className="mb-6">
        <textarea
          placeholder="Paste your study text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-[#1e1d24] border border-[#8BA5BE]/30 text-white outline-none focus:border-[#E19C63] resize-none"
        />
        <Button onClick={generateCards} disabled={loading} className="mt-2">
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </Button>
      </div>

      {cards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Cards ({cards.length})</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={saveCards}>Save Cards</Button>
              <Button onClick={() => router.push(`/dashboard/collections/${id}/study`)}>Study</Button>
              <Button onClick={() => router.push(`/dashboard/collections/${id}/quiz`)}>Quiz</Button>
            </div>
          </div>
          <div className="space-y-3">
            {cards.map((card, i) => (
              <div key={i} className="bg-[#1e1d24] p-4 rounded-xl">
                <input
                  value={card.question}
                  onChange={(e) => updateCard(i, 'question', e.target.value)}
                  className="w-full bg-transparent font-semibold mb-2 outline-none border-b border-transparent focus:border-[#E19C63] pb-1"
                />
                <textarea
                  value={card.answer}
                  onChange={(e) => updateCard(i, 'answer', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-sm text-[#8BA5BE] outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
