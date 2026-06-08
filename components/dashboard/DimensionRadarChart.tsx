'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { DimensionScore } from '@/lib/scoring';
import { dimensionToRadarData } from '@/lib/dimensionScores';

export function DimensionRadarChart({ dimensions }: { dimensions: DimensionScore[] }) {
  const data = dimensionToRadarData(dimensions);

  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Cognitive Profile</h2>
      <p className="text-slate-500 mb-6">Your full profile across all dimensions</p>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#64748B', fontSize: 13 }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#1D4ED8"
              fill="#2563EB"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
