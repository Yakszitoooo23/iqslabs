'use client';

import {
  formatTestsTaken,
  getDailyAverageScore,
  getDailyTestsTaken,
} from '@/lib/dailyStats';

export function QuizSocialProof() {
  const testsToday = getDailyTestsTaken();
  const averageScore = getDailyAverageScore();

  return (
    <footer className="mt-auto bg-accent">
      <div className="max-w-6xl mx-auto px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-8 text-center text-sm sm:text-base text-white">
        <p>
          <span className="font-bold text-lg sm:text-xl tabular-nums">
            {formatTestsTaken(testsToday)}
          </span>{' '}
          people have taken this test today
        </p>
        <span className="hidden sm:inline text-blue-200" aria-hidden>
          ·
        </span>
        <p>
          Today&apos;s average score:{' '}
          <span className="font-bold text-lg sm:text-xl tabular-nums">{averageScore}</span>
        </p>
      </div>
    </footer>
  );
}
