'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SharedPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<{ title: string; cards: { question: string; answer: string }[] } | null>(null);

  useEffect(() => {
    fetch(`/api/shared/${token}`).then(r => r.ok ? r.json() : null).then(setData);
  }, [token]);

  if (!data) return <div className="flex items-center justify-center min-h-screen text-[#777777]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#3c3c3c] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-1">{data.title}</h1>
          <p className="text-[#777777]">Shared flashcard collection</p>
        </div>
        <div className="space-y-3">
          {data.cards.map((card, i) => (
            <div key={i} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-5">
              <p className="font-bold mb-1 text-[#3c3c3c]">{card.question}</p>
              <p className="text-sm text-[#777777]">{card.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
