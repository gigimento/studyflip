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

  if (loading) return <div className="flex items-center justify-center min-h-screen text-[#777777]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-[#e5e5e5]">
        <Link href="/dashboard" className="text-xl font-extrabold text-[#3c3c3c]">Study<span className="text-[#58cc02]">Flip</span></Link>
        <button
          onClick={() => { localStorage.removeItem('sessionId'); router.push('/auth/login'); }}
          className="text-sm font-semibold text-[#777777] hover:text-[#3c3c3c] cursor-pointer bg-white border-2 border-[#e5e5e5] rounded-xl px-4 py-2 border-b-[3px] active:translate-y-[2px] active:border-b-[1px] transition-all"
        >
          Sign Out
        </button>
      </nav>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
