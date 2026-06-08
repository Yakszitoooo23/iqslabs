import Link from 'next/link';
import type { TrainingRecommendation } from '@/lib/trainingRecommendations';

export function RecommendedTraining({ recommendation }: { recommendation: TrainingRecommendation }) {
  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Recommended for You</h2>
        <p className="text-slate-500 text-sm">{recommendation.reason}</p>
      </div>

      <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-slate-900">{recommendation.gameName}</p>
          <p className="text-sm text-slate-600 mt-1">{recommendation.gameDescription}</p>
          <p className="text-xs text-slate-500 mt-2">
            Targets: {recommendation.targetDimension}
          </p>
        </div>
        <Link
          href={recommendation.gameHref}
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shrink-0"
        >
          Start Training →
        </Link>
      </div>

      <Link
        href="/games"
        className="block text-center text-sm font-medium text-slate-600 hover:text-blue-600 transition"
      >
        Or explore all brain training games →
      </Link>
    </section>
  );
}
