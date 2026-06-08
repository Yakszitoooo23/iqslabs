'use client';

import { useCallback, useEffect, useState } from 'react';
import { PatternMatrixGrid, PatternOptionGrid } from '@/components/patterns/PatternCell';
import { GameLayout, GameResult, PrimaryButton } from '@/components/games/GameLayout';
import { PRACTICE_QUESTION_BANK, type PracticeQuestion } from '@/data/practiceQuestions';
import { getPerformanceRating, pickBalancedQuestions } from '@/lib/gameUtils';

type Phase = 'intro' | 'playing' | 'feedback' | 'done';

const SESSION_KEY = 'iq_practice_session';

export default function IqPracticePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const startGame = useCallback(() => {
    const picked = pickBalancedQuestions(PRACTICE_QUESTION_BANK, {
      easy: 3,
      medium: 4,
      hard: 3,
    });
    setQuestions(picked);
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
        title="IQ Practice"
        subtitle="10 visual pattern questions, no timer, instant feedback."
      >
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center space-y-6">
          <p className="text-slate-600 max-w-md mx-auto">
            Complete the pattern matrix for each question. A new random set of 10 practice
            questions is chosen each round.
          </p>
          <PrimaryButton onClick={startGame}>Start Practice</PrimaryButton>
        </div>
      </GameLayout>
    );
  }

  if (phase === 'done') {
    return (
      <GameLayout title="IQ Practice" backLabel="← Back to games">
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
      title="IQ Practice"
      subtitle={`Question ${qIndex + 1} of ${questions.length}`}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Which figure completes the pattern?
            </h2>
            <div className="flex justify-center lg:justify-start">
              <PatternMatrixGrid
                grid={current.grid}
                cellSize={current.grid.length === 2 ? 72 : 58}
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">Choose answer:</p>
            <div
              className={
                feedback === 'correct'
                  ? 'rounded-xl ring-2 ring-emerald-400 ring-offset-2 transition'
                  : feedback === 'wrong'
                    ? 'rounded-xl ring-2 ring-red-400 ring-offset-2 transition'
                    : ''
              }
            >
              <PatternOptionGrid
                options={current.options}
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
                cellSize={48}
              />
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
