'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Study<span className="text-[#E19C63]">Flip</span>
      </h1>
      <p className="text-lg text-[#8BA5BE] max-w-md mb-8">
        Upload your notes, PDFs, or text. Let AI generate flashcards instantly.
        Study smarter with flip cards and quizzes.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push('/auth/login')}>Get Started</Button>
      </div>
    </div>
  );
}
