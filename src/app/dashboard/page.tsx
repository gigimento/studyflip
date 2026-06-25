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
            <h2 className="text-lg font-semibold text-[#E19C63]">Due for Review ({dueCards.length})</h2>
          </div>
          <div className="space-y-2">
            {dueCards.slice(0, 5).map((card) => (
              <div key={card.id} className="bg-[#1e1d24] p-3 rounded-xl flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{card.question}</p>
                  <p className="text-sm text-[#8BA5BE] truncate">{card.collectionTitle}</p>
                </div>
                <Button variant="secondary" onClick={() => router.push(`/dashboard/collections/${card.collectionId}/study`)} className="ml-3 shrink-0">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <Button onClick={() => router.push('/dashboard/new')}>+ New Collection</Button>
      </div>
      {collections.length === 0 ? (
        <p className="text-[#8BA5BE] text-center py-12">No collections yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4">
          {collections.map((c) => (
            <div key={c.id} className="bg-[#1e1d24] p-5 rounded-xl flex items-center justify-between">
              <div onClick={() => router.push(`/dashboard/collections/${c.id}`)} className="cursor-pointer flex-1">
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <p className="text-sm text-[#8BA5BE]">{c.subject} &middot; {c.card_count} cards</p>
              </div>
              <button onClick={() => deleteCollection(c.id)} className="text-red-400 text-sm hover:text-red-300 cursor-pointer">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
