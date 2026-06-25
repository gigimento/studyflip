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
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-5xl font-bold text-[#E19C63] mb-2">{score} / {questions.length}</p>
        <p className="text-[#8BA5BE] mb-8">{Math.round(score / questions.length * 100)}% correct</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={generateQuiz}>Retry</Button>
          <Button variant="secondary" onClick={() => router.push(`/dashboard/collections/${id}/study`)}>Study Cards</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-[#8BA5BE] mb-4">No quiz questions yet.</p>
        <Button onClick={generateQuiz} disabled={loading}>{loading ? 'Generating...' : 'Generate Quiz Questions'}</Button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push(`/dashboard/collections/${id}`)} className="text-[#8BA5BE] hover:text-white cursor-pointer">&larr; Back</button>
        <span className="text-[#8BA5BE] text-sm">{index + 1} / {questions.length}</span>
      </div>

      <h2 className="text-xl font-semibold mb-6">{q.question}</h2>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          let bg = 'bg-[#1e1d24] hover:border-[#8BA5BE]/30';
          if (answered) {
            if (i === q.correct_index) bg = 'bg-green-900/40 border-green-500/50';
            else if (i === selected) bg = 'bg-red-900/40 border-red-500/50';
          }
          return (
            <div
              key={i}
              onClick={() => answer(i)}
              className={`${bg} border border-[#8BA5BE]/10 rounded-xl p-4 cursor-pointer transition-all`}
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
