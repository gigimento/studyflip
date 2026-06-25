'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Question = { id: string; question: string; options: string[]; correct_index: number };

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    fetch(`/api/collections/${id}/quiz`, { headers: { 'x-session-id': sessionId || '' } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (data.length > 0) setQuestions(data);
      });
  }, [id]);

  async function generateQuiz() {
    setLoading(true);
    const sessionId = localStorage.getItem('sessionId');
    const res = await fetch(`/api/collections/${id}/quiz/generate`, {
      method: 'POST',
      headers: { 'x-session-id': sessionId || '' },
    });
    const data = await res.json();
    if (data.questions) setQuestions(data.questions);
    setLoading(false);
    setIndex(0);
    setScore(0);
    setFinished(false);
  }

  function answer(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === questions[index].correct_index) setScore(s => s + 1);
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-6xl mb-4">{score === questions.length ? '\uD83C\uDF89' : '\uD83D\uDCAF'}</div>
        <h2 className="text-2xl font-extrabold text-[#3c3c3c] mb-2">Quiz Complete!</h2>
        <div className="inline-block bg-[#dbf8c5] rounded-2xl px-8 py-4 mb-6">
          <p className="text-5xl font-extrabold text-[#58cc02]">{score} / {questions.length}</p>
        </div>
        <div className="h-4 bg-[#e5e5e5] rounded-full max-w-xs mx-auto mb-8 overflow-hidden">
          <div className="h-full bg-[#58cc02] rounded-full transition-all duration-500" style={{ width: `${Math.round(score / questions.length * 100)}%` }} />
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={generateQuiz}>Retry</Button>
          <Button variant="secondary" onClick={() => router.push(`/dashboard/collections/${id}`)}>Back to Collection</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-[#777777] mb-4">No quiz questions yet.</p>
        <Button onClick={generateQuiz} disabled={loading}>{loading ? 'Generating...' : 'Generate Quiz Questions'}</Button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push(`/dashboard/collections/${id}`)} className="text-[#777777] font-bold hover:text-[#3c3c3c] cursor-pointer">&larr; Back</button>
        <div className="flex items-center gap-2">
          <div className="bg-[#dbf8c5] text-[#58a700] text-sm font-bold px-3 py-1 rounded-full">{index + 1} / {questions.length}</div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-[#3c3c3c]">{q.question}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          let style = 'bg-white border-2 border-[#e5e5e5] hover:border-[#afafaf] text-[#3c3c3c]';
          if (answered) {
            if (i === q.correct_index) style = 'bg-[#dbf8c5] border-2 border-[#58cc02] text-[#3c3c3c] font-bold';
            else if (i === selected) style = 'bg-[#ff4b4b]/10 border-2 border-[#ff4b4b] text-[#ff4b4b]';
          }
          return (
            <div
              key={i}
              onClick={() => answer(i)}
              className={`${style} rounded-2xl p-4 cursor-pointer transition-all`}
            >
              {opt}
            </div>
          );
        })}
      </div>

      {answered && (
        <Button onClick={next} className="w-full">
          {index < questions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      )}
    </div>
  );
}
