'use client';

import type { PerformanceMetricsData } from '@/lib/performanceMetrics';
import { POPULATION_AVG_SECONDS } from '@/lib/performanceMetrics';

export function PerformanceMetricsSection({ metrics }: { metrics: PerformanceMetricsData }) {
  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Average Response Time</p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              metrics.fasterThanPopulation ? 'text-emerald-600' : 'text-slate-700'
            }`}
          >
            {metrics.avgResponseTimeSeconds}s
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Population average: {POPULATION_AVG_SECONDS}s
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Test Duration</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.durationMinutes}m {metrics.durationSeconds}s
          </p>
          <p className="text-sm text-slate-500 mt-2">{metrics.durationSubtitle}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Test Persistence</p>
          <p className="text-2xl font-bold text-slate-900">Top 9%</p>
          <p className="text-sm text-slate-500 mt-2">Of users complete the full assessment</p>
        </div>
      </div>
    </section>
  );
}
