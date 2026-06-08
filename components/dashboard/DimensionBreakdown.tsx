import type { DimensionScore } from '@/lib/scoring';
import { COGNITIVE_DIMENSIONS, getScoreDescriptor } from '@/lib/dimensionScores';

export function DimensionBreakdown({ dimensions }: { dimensions: DimensionScore[] }) {
  const ordered = COGNITIVE_DIMENSIONS.map(({ key }) =>
    dimensions.find((d) => d.key === key),
  ).filter(Boolean) as DimensionScore[];

  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Cognitive Dimensions</h2>
      <p className="text-slate-500 mb-8">Your performance across 5 cognitive domains</p>
      <div className="space-y-6">
        {ordered.map((dim) => (
          <DimensionRow key={dim.key} dimension={dim} />
        ))}
      </div>
    </section>
  );
}

function DimensionRow({ dimension }: { dimension: DimensionScore }) {
  const score = dimension.score;
  const descriptor = getScoreDescriptor(score);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="sm:w-[30%] shrink-0">
        <p className="text-sm font-medium text-slate-900">{dimension.name}</p>
      </div>
      <div className="sm:w-[50%] flex-1 relative pt-3">
        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
          <div
            className="absolute top-0 w-px h-3 bg-slate-400"
            style={{ left: '50%' }}
          />
        </div>
        <span
          className="absolute text-xs text-slate-400"
          style={{ left: '50%', top: '100%', transform: 'translateX(-50%) translateY(2px)' }}
        >
          avg
        </span>
      </div>
      <div className="sm:w-[20%] sm:text-right shrink-0">
        <p className="text-sm tabular-nums">
          <span className="font-semibold text-slate-900">{score}</span>
          <span className="text-slate-400 mx-1">·</span>
          <span className={descriptor.colorClass}>{descriptor.label}</span>
        </p>
      </div>
    </div>
  );
}
