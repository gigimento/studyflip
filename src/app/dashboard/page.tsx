'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Collection = { id: string; title: string; subject: string; card_count: number; created_at: string };
type DueCard = { id: string; question: string; answer: string; collectionId: string; collectionTitle: string };

export default function DashboardPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [dueCards, setDueCards] = useState<DueCard[]>([]);

  const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

  async function loadCollections() {
    const res = await fetch('/api/collections', { headers: { 'x-session-id': sessionId || '' } });
    if (res.ok) setCollections(await res.json());
  }

  async function loadDueCards() {
    const res = await fetch('/api/cards/due', { headers: { 'x-session-id': sessionId || '' } });
    if (res.ok) setDueCards(await res.json());
  }

  useEffect(() => { loadCollections(); loadDueCards(); }, [sessionId]);

  async function deleteCollection(id: string) {
    await fetch(`/api/collections/${id}`, { method: 'DELETE', headers: { 'x-session-id': sessionId || '' } });
    loadCollections();
  }

  return (
    <div>
      {dueCards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#ff9600] text-xl">&#x1F525;</span>
              <h2 className="text-lg font-bold text-[#3c3c3c]">Due for Review ({dueCards.length})</h2>
            </div>
          </div>
          <div className="space-y-2">
            {dueCards.slice(0, 5).map((card) => (
              <div key={card.id} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold text-[#3c3c3c]">{card.question}</p>
                  <p className="text-sm text-[#777777] truncate">{card.collectionTitle}</p>
                </div>
                <Button onClick={() => router.push(`/dashboard/collections/${card.collectionId}/study`)} className="ml-3 shrink-0 text-sm px-4 py-2">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#3c3c3c]">My Collections</h1>
        <Button onClick={() => router.push('/dashboard/new')} className="flex items-center gap-1">
          <span className="text-lg leading-none">+</span> New Collection
        </Button>
      </div>
      {collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">&#x1F4DA;</div>
          <p className="text-[#777777] mb-4">No collections yet. Create your first one!</p>
          <Button onClick={() => router.push('/dashboard/new')}>Create Collection</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {collections.map((c) => (
            <div key={c.id} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-5 flex items-center justify-between hover:border-[#afafaf] transition-colors">
              <div onClick={() => router.push(`/dashboard/collections/${c.id}`)} className="cursor-pointer flex-1">
                <h3 className="font-bold text-lg text-[#3c3c3c]">{c.title}</h3>
                <p className="text-sm text-[#777777]">{c.subject} &middot; {c.card_count} cards</p>
              </div>
              <button onClick={() => deleteCollection(c.id)} className="text-sm text-[#ff4b4b] font-bold hover:underline cursor-pointer ml-4">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
