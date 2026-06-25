'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NewCollectionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  async function create() {
    if (!title) return;
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
      body: JSON.stringify({ title, subject }),
    });
    const data = await res.json();
    if (data.id) router.push(`/dashboard/collections/${data.id}`);
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Collection</h1>
      <input
        type="text" placeholder="Collection Title" value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#1e1d24] border border-[#8BA5BE]/30 text-white mb-3 outline-none focus:border-[#E19C63]"
      />
      <input
        type="text" placeholder="Subject (optional)" value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#1e1d24] border border-[#8BA5BE]/30 text-white mb-6 outline-none focus:border-[#E19C63]"
      />
      <Button onClick={create}>Create Collection</Button>
    </div>
  );
}
