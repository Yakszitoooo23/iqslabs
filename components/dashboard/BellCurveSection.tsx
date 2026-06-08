'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { generateBellCurveData } from '@/lib/bellCurve';

interface BellCurveSectionProps {
  iqScore: number;
}

const CURVE_DATA = generateBellCurveData();

export function BellCurveSection({ iqScore }: BellCurveSectionProps) {
  const clampedScore = Math.max(55, Math.min(145, iqScore));

  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
        Cognitive Assessment Report
      </h2>
      <p className="text-slate-600 text-center max-w-2xl mx-auto mb-8">
        Your complete test results including IQ score, cognitive profile, global rankings and
        detailed performance analysis.
      </p>

      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
        <div className="w-full h-[320px] md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CURVE_DATA} margin={{ top: 28, right: 16, left: 8, bottom: 28 }}>
              <defs>
                <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.55} />
                  <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#DBEAFE" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="iq"
                type="number"
                domain={[55, 145]}
                ticks={[75, 100, 125]}
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={{ stroke: '#CBD5E1' }}
                label={{
                  value: 'IQ Score',
                  position: 'insideBottom',
                  offset: -8,
                  fill: '#64748B',
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: 'Probability Density',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 12,
                  fill: '#64748B',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#bellGradient)"
                isAnimationActive={false}
              />
              <ReferenceLine
                x={75}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <ReferenceLine
                x={125}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <ReferenceLine
                x={clampedScore}
                stroke="#1D4ED8"
                strokeWidth={2.5}
                strokeDasharray="6 3"
                label={{
                  value: `Your IQ: ${iqScore}`,
                  position: 'top',
                  fill: '#1D4ED8',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500 flex items-start gap-1.5 justify-center text-center max-w-2xl mx-auto">
        <span aria-hidden className="shrink-0 mt-0.5">
          ⓘ
        </span>
        <span>
          Score based on{' '}
          <a
            href="https://en.wikipedia.org/wiki/Raven%27s_Progressive_Matrices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Raven&apos;s Progressive Matrices
          </a>
          , standardized to the IQ scale (mean: 100, standard deviation: 15).
        </span>
      </p>
    </section>
  );
}
