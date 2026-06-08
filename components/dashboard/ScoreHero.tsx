import type { LocalTestResult } from '@/lib/localResults';

export function ScoreHero({ result }: { result: LocalTestResult }) {
  const topPercent = Math.max(1, Math.round(100 - result.percentile));
  const minutes = Math.floor(result.time_taken_seconds / 60);
  const seconds = result.time_taken_seconds % 60;

  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center">
      <p className="text-sm text-slate-400 uppercase tracking-wide mb-3">Your IQ Score</p>
      <p className="text-7xl font-bold text-blue-600 mb-2 tabular-nums">{result.scaled_score}</p>
      <p className="text-lg text-slate-600 mb-8">{result.category}</p>
      <div className="border-t border-slate-200 pt-6 grid grid-cols-2 gap-6 max-w-md mx-auto">
        <div>
          <p className="text-sm text-slate-500 mb-1">Percentile rank</p>
          <p className="text-2xl font-semibold text-slate-900">Top {topPercent}%</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Test duration</p>
          <p className="text-2xl font-semibold text-slate-900">
            {minutes}m {seconds}s
          </p>
        </div>
      </div>
    </section>
  );
}
