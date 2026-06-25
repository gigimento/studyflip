'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit() {
    if (!email) return;
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { email, name: name || email.split('@')[0] } : { email };
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.sessionId) {
      localStorage.setItem('sessionId', data.sessionId);
      router.push('/dashboard');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-extrabold mb-6 text-[#3c3c3c]">{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[#3c3c3c] mb-3 outline-none focus:border-[#1cb0f6] transition-colors"
        />
        {isRegister && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[#3c3c3c] mb-3 outline-none focus:border-[#1cb0f6] transition-colors"
          />
        )}
        <Button onClick={handleSubmit} className="w-full mb-3">
          {isRegister ? 'Create Account' : 'Sign In'}
        </Button>
        <p className="text-sm text-[#777777] text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-[#58cc02] font-bold hover:underline cursor-pointer">
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
