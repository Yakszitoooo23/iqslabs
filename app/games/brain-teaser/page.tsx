'use client';

import { useCallback, useEffect, useState } from 'react';
import { GameLayout, GameResult, PrimaryButton } from '@/components/games/GameLayout';
import { BRAIN_TEASER_BANK, type BrainTeaser } from '@/data/brainTeasers';
import { getPerformanceRating, pickBrainTeasers } from '@/lib/gameUtils';

type Phase = 'intro' | 'playing' | 'feedback' | 'done';

const SESSION_KEY = 'brain_teaser_session';

export default function BrainTeaserPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<BrainTeaser[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const startGame = useCallback(() => {
    setQuestions(pickBrainTeasers(BRAIN_TEASER_BANK));
    setQIndex(0);
    setCorrectCount(0);
    setSelectedIndex(undefined);
    setFeedback(null);
    setPhase('playing');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ started: Date.now() }));
  }, []);

  useEffect(() => {
    return () => sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const current = questions[qIndex];

  function handleSelect(index: number) {
    if (phase !== 'playing' || !current || selectedIndex !== undefined) return;
    setSelectedIndex(index);
    const isCorrect = index === current.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setPhase('feedback');
    setTimeout(() => {
      if (qIndex >= questions.length - 1) {
        setPhase('done');
      } else {
        setQIndex((i) => i + 1);
        setSelectedIndex(undefined);
        setFeedback(null);
        setPhase('playing');
      }
    }, 800);
  }

  if (phase === 'intro') {
    return (
      <GameLayout
        title="Brain Teaser"
        subtitle="10 logic puzzles and riddles, no timer, instant feedback."
      >
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center space-y-6">
          <p className="text-slate-600 max-w-md mx-auto">
            Logic riddles, math puzzles, lateral thinking, and more. A fresh set of 10 questions
            each round.
          </p>
          <PrimaryButton onClick={startGame}>Start</PrimaryButton>
        </div>
      </GameLayout>
    );
  }

  if (phase === 'done') {
    return (
      <GameLayout title="Brain Teaser" backLabel="← Back to games">
        <GameResult
          correct={correctCount}
          total={questions.length}
          rating={getPerformanceRating(correctCount, questions.length)}
          onPlayAgain={startGame}
        />
      </GameLayout>
    );
  }

  if (!current) return null;

  return (
    <GameLayout
      title="Brain Teaser"
      subtitle={`Question ${qIndex + 1} of ${questions.length}`}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <p className="text-xs uppercase tracking-wide text-slate-500">{current.category}</p>
        <h2 className="text-xl md:text-2xl font-semibold text-[#0F172A] leading-snug">
          {current.question}
        </h2>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            const selected = selectedIndex === i;
            let bg = 'bg-emerald-50 hover:bg-emerald-100/80';
            if (selected && feedback === 'correct') bg = 'bg-emerald-200 ring-2 ring-emerald-500';
            else if (selected && feedback === 'wrong') bg = 'bg-red-100 ring-2 ring-red-500';
            else if (selected) bg = 'bg-emerald-100 ring-2 ring-[#2563EB]';

            return (
              <button
                key={i}
                type="button"
                disabled={selectedIndex !== undefined}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-5 py-4 rounded-xl transition ${bg} disabled:cursor-default`}
              >
                <span className="text-[#0F172A] font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
