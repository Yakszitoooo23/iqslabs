import type { ReactNode } from 'react';
import {
  GROWTH_EXPLANATIONS,
  STRENGTH_EXPLANATIONS,
} from '@/lib/dimensionScores';

interface StrengthsGrowthProps {
  strengths: string[];
  growthAreas: string[];
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InsightRow({
  name,
  explanation,
  icon,
}: {
  name: string;
  explanation: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}

export function StrengthsGrowth({ strengths, growthAreas }: StrengthsGrowthProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h2 className="text-lg font-bold text-emerald-600 mb-5">Your Strengths</h2>
        {strengths.length === 0 ? (
          <p className="text-slate-500 text-sm">Complete more scored questions to reveal strengths.</p>
        ) : (
          <div className="space-y-5">
            {strengths.map((name) => (
              <InsightRow
                key={name}
                name={name}
                explanation={STRENGTH_EXPLANATIONS[name] ?? 'A relative strength in your cognitive profile.'}
                icon={<CheckIcon />}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h2 className="text-lg font-bold text-blue-600 mb-5">Growth Areas</h2>
        {growthAreas.length === 0 ? (
          <p className="text-slate-500 text-sm">No distinct growth areas identified yet.</p>
        ) : (
          <div className="space-y-5">
            {growthAreas.map((name) => (
              <InsightRow
                key={name}
                name={name}
                explanation={GROWTH_EXPLANATIONS[name] ?? 'Targeted practice can develop this dimension over time.'}
                icon={<ArrowUpIcon />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
