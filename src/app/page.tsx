'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="max-w-md">
        <div className="inline-block bg-[#dbf8c5] text-[#58a700] text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          AI-Powered Learning
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-[#3c3c3c]">
          Study<span className="text-[#58cc02]">Flip</span>
        </h1>
        <p className="text-lg text-[#777777] mb-8 leading-relaxed">
          Turn your notes into smart flashcards with AI.
          Study with flip cards, quizzes, and spaced repetition.
        </p>
        <Button onClick={() => router.push('/auth/login')} className="text-lg px-10 py-4">
          Get Started Free
        </Button>
        <p className="text-sm text-[#afafaf] mt-4">No credit card required</p>
      </div>
    </div>
  );
}
