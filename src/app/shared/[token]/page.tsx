'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SharedPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<{ title: string; cards: { question: string; answer: string }[] } | null>(null);

  useEffect(() => {
    fetch(`/api/shared/${token}`).then(r => r.ok ? r.json() : null).then(setData);
  }, [token]);

  if (!data) return <div className="flex items-center justify-center min-h-screen bg-[#27262E] text-[#8BA5BE]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#27262E] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <p className="text-[#8BA5BE] mb-6">Shared flashcard collection</p>
        <div className="space-y-3">
          {data.cards.map((card, i) => (
            <div key={i} className="bg-[#1e1d24] p-4 rounded-xl">
              <p className="font-semibold mb-1">{card.question}</p>
              <p className="text-sm text-[#8BA5BE]">{card.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
