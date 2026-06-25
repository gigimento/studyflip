'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-[#8BA5BE]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#27262E]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#8BA5BE]/20">
        <Link href="/dashboard" className="text-xl font-bold">Study<span className="text-[#E19C63]">Flip</span></Link>
        <button
          onClick={() => { localStorage.removeItem('sessionId'); router.push('/auth/login'); }}
          className="text-sm text-[#8BA5BE] hover:text-white cursor-pointer"
        >
          Sign Out
        </button>
      </nav>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
