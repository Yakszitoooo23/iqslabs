'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyzingWarningModal } from '@/components/analyzing/AnalyzingWarningModal';
import { SKIP_PAYWALL } from '@/lib/featureFlags';
import { loadSession } from '@/lib/quizSession';
import { scoreMultiPhaseTest } from '@/lib/scoring';

const DURATION_MS = 10_000;
const TICK_MS = 50;
const NAVIGATE_DELAY_MS = 600;

const DIMENSIONS = [
  'Memory',
  'Speed',
  'Logic',
  'Spatial Recognition',
  'Pattern Recognition',
] as const;

export default function AnalyzingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [warningOpen, setWarningOpen] = useState(true);

  const apiCompleteRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const navigatedRef = useRef(false);

  const maybeNavigate = useCallback(() => {
    if (navigatedRef.current) return;
    if (apiCompleteRef.current && minTimeElapsedRef.current) {
      navigatedRef.current = true;
      const destination = SKIP_PAYWALL ? '/dashboard?preview=paid' : '/results';
      setTimeout(() => router.push(destination), NAVIGATE_DELAY_MS);
    }
  }, [router]);

  useEffect(() => {
    const answersRaw = sessionStorage.getItem('quiz_answers');
    if (!answersRaw) {
      router.replace('/quiz');
      return;
    }

    const session = loadSession();
    if (!session) {
      router.replace('/quiz');
      return;
    }

    const timeTaken = Number(sessionStorage.getItem('quiz_time') || 0);

    const scoreResult = scoreMultiPhaseTest(
      undefined,
      {
        stepAnswers: session.stepAnswers,
        likertAnswers: session.likertAnswers,
        goalAnswers: session.goalAnswers,
        demographicAnswers: session.demographicAnswers,
      },
      { timeTakenSeconds: timeTaken },
    );

    sessionStorage.setItem('score_result', JSON.stringify(scoreResult));

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scaledScore: scoreResult.scaledScore,
        percentile: scoreResult.percentile,
        category: scoreResult.category,
        strengths: scoreResult.strengths,
        weaknesses: scoreResult.weaknesses,
        improvementGoal: scoreResult.improvementGoal,
        cognitiveProfile: scoreResult.cognitiveProfile,
        demographics: scoreResult.demographics,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.interpretation) {
          sessionStorage.setItem('ai_interpretation', data.interpretation);
        }
      })
      .catch(() => {
        // Navigate anyway; results/checkout will use empty interpretation if missing
      })
      .finally(() => {
        apiCompleteRef.current = true;
        maybeNavigate();
      });

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += TICK_MS;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        minTimeElapsedRef.current = true;
        maybeNavigate();
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [maybeNavigate, router]);

  const checkedCount = Math.min(DIMENSIONS.length, Math.floor(progress / 20));
  const showPercent = progress >= 15;

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <AnalyzingWarningModal open={warningOpen} onClose={() => setWarningOpen(false)} />

      <div className="w-full max-w-2xl text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Calculating your
            <br />
            <span className="text-blue-600">IQ score...</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Our AI is reviewing your answers against the 5 key dimensions of cognitive intelligence.
          </p>
        </div>

        <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-[width] duration-75 ease-linear flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {showPercent && (
              <span className="text-[10px] font-semibold text-white leading-none">
                {Math.round(progress)}%
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-4 text-left max-w-sm mx-auto">
          {DIMENSIONS.map((label, i) => {
            const checked = i < checkedCount;
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    checked
                      ? 'bg-blue-600 border-blue-600 text-white scale-100'
                      : 'border-slate-300 bg-white scale-100'
                  } ${checked ? 'animate-[scaleIn_0.3s_ease-out]' : ''}`}
                >
                  {checked && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-lg transition-colors duration-300 ${
                    checked ? 'text-slate-900 font-medium' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
