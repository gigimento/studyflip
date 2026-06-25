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
  const [shareUrl, setShareUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    fetch(`/api/collections/${id}/cards`, { headers: { 'x-session-id': sessionId || '' } })
      .then(r => r.ok ? r.json() : [])
      .then(setCards);
  }, [id]);

  async function generateCards() {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch(`/api/collections/${id}/cards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (data.cards) setCards(data.cards);
    if (data.error) setError(data.error);
    setLoading(false);
  }

  async function saveCards() {
    setError('');
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch(`/api/collections/${id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ cards }),
    });
    const data = await res.json();
    if (data.error) return setError(data.error);
    if (Array.isArray(data)) setCards(data);
  }

  async function shareCollection() {
    setSharing(true);
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch(`/api/collections/${id}/share`, { method: 'POST', headers: { 'x-session-id': sessionId || '' } });
    const data = await res.json();
    if (data.url) setShareUrl(window.location.origin + data.url);
    setSharing(false);
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
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#e5e5e5] text-[#3c3c3c] outline-none focus:border-[#1cb0f6] resize-none transition-colors"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <Button onClick={generateCards} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
          {cards.length > 0 && (
            <>
              <Button onClick={saveCards} variant="secondary">Save Cards</Button>
              <Button onClick={() => router.push(`/dashboard/collections/${id}/study`)}>Study</Button>
              <Button onClick={() => router.push(`/dashboard/collections/${id}/quiz`)}>Quiz</Button>
              <Button onClick={shareCollection} disabled={sharing} variant="secondary">
                {sharing ? 'Sharing...' : shareUrl ? 'Copied!' : 'Share'}
              </Button>
            </>
          )}
        </div>
        {shareUrl && (
          <p className="text-sm text-[#777777] mt-2">Link: {shareUrl}</p>
        )}
        {error && <p className="text-sm text-[#ff4b4b] mt-2 font-bold">{error}</p>}
      </div>

      {cards.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#3c3c3c] mb-4">Cards ({cards.length})</h2>
          <div className="space-y-3">
            {cards.map((card, i) => (
              <div key={i} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4">
                <input
                  value={card.question}
                  onChange={(e) => updateCard(i, 'question', e.target.value)}
                  className="w-full bg-transparent font-bold text-[#3c3c3c] mb-2 outline-none border-b-2 border-transparent focus:border-[#1cb0f6] pb-1 transition-colors"
                />
                <textarea
                  value={card.answer}
                  onChange={(e) => updateCard(i, 'answer', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-sm text-[#777777] outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
