'use client';

import { BrainGamesSection } from '@/components/dashboard/BrainGamesSection';
import { ScoreHero } from '@/components/dashboard/ScoreHero';
import { BellCurveSection } from '@/components/dashboard/BellCurveSection';
import { DimensionBreakdown } from '@/components/dashboard/DimensionBreakdown';
import { StrengthsGrowth } from '@/components/dashboard/StrengthsGrowth';
import { DimensionRadarChart } from '@/components/dashboard/DimensionRadarChart';
import { PerformanceMetricsSection } from '@/components/dashboard/PerformanceMetricsSection';
import { AiInterpretationSection } from '@/components/dashboard/AiInterpretationSection';
import { ReferralSection } from '@/components/dashboard/ReferralSection';
import { CertificateSection } from '@/components/dashboard/CertificateSection';
import { RecommendedTraining } from '@/components/dashboard/RecommendedTraining';
import {
  SubscriptionStatusBadge,
  SubscriptionStatusBanner,
} from '@/components/dashboard/SubscriptionStatus';
import type { LocalTestResult } from '@/lib/localResults';
import type { SubscriptionInfo } from '@/lib/subscriptionUi';
import { computePerformanceMetrics } from '@/lib/performanceMetrics';
import type { DimensionScore } from '@/lib/scoring';
import { getTrainingRecommendation } from '@/lib/trainingRecommendations';
import { referralCodeFromUserId } from '@/lib/referral';

interface CustomerDashboardProps {
  email: string;
  result: LocalTestResult;
  showDevBanner?: boolean;
  subscription?: SubscriptionInfo;
  onManageSubscription?: () => void;
  managingSubscription?: boolean;
  userId?: string;
  referralCode?: string;
  fullName?: string | null;
}

export function CustomerDashboard({
  email,
  result,
  showDevBanner = false,
  subscription,
  onManageSubscription,
  managingSubscription = false,
  userId,
  referralCode: referralCodeProp,
  fullName,
}: CustomerDashboardProps) {
  const performanceMetrics = computePerformanceMetrics(result.time_taken_seconds);
  const training = getTrainingRecommendation(result.weaknesses, result.dimensionScores);
  const referralCode =
    referralCodeProp ?? (userId ? referralCodeFromUserId(userId) : 'preview01');

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 md:py-12">
      {showDevBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 mb-8">
          Preview: post-purchase customer dashboard. Subscription shown as active (trialing).
        </div>
      )}

      {subscription && (
        <div className="mb-6">
          <SubscriptionStatusBanner
            subscription={subscription}
            onManageSubscription={onManageSubscription}
            managingSubscription={managingSubscription}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Your Dashboard</h1>
            {subscription && <SubscriptionStatusBadge subscription={subscription} />}
          </div>
          <p className="text-slate-500 text-sm mt-1">{email}</p>
        </div>
        {onManageSubscription && (
          <button
            type="button"
            onClick={onManageSubscription}
            disabled={managingSubscription}
            className="shrink-0 text-sm font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
          >
            {managingSubscription ? 'Opening…' : 'Manage subscription'}
          </button>
        )}
      </div>

      <div className="space-y-8">
        <ScoreHero result={result} />
        <BrainGamesSection />
        <BellCurveSection iqScore={result.scaled_score} />
        <DimensionBreakdown dimensions={result.dimensionScores} />
        <StrengthsGrowth strengths={result.strengths} growthAreas={result.weaknesses} />
        <DimensionRadarChart dimensions={result.dimensionScores} />
        <PerformanceMetricsSection metrics={performanceMetrics} />
        <AiInterpretationSection interpretation={result.ai_interpretation} />
        <ReferralSection referralCode={referralCode} />
        <CertificateSection
          result={result}
          referralCode={referralCode}
          userId={userId}
          initialName={fullName ?? ''}
        />
        <RecommendedTraining recommendation={training} />
      </div>
    </main>
  );
}

const MOCK_DIMENSIONS: DimensionScore[] = [
  { key: 'memory', name: 'Memory', score: 78, correct: 1, total: 1, tested: true },
  { key: 'speed', name: 'Speed', score: 62, correct: 0, total: 0, tested: true },
  { key: 'logic', name: 'Logic', score: 85, correct: 1, total: 1, tested: true },
  { key: 'spatial', name: 'Spatial Recognition', score: 45, correct: 5, total: 11, tested: true },
  { key: 'pattern', name: 'Pattern Recognition', score: 38, correct: 4, total: 10, tested: true },
];

export function getPreviewMockResult(): LocalTestResult {
  return {
    scaled_score: 118,
    percentile: 84,
    raw_score: 42,
    category: 'Above Average',
    strengths: ['Memory', 'Logic'],
    weaknesses: ['Pattern Recognition', 'Spatial Recognition'],
    dimensionScores: MOCK_DIMENSIONS,
    time_taken_seconds: 892,
    performanceMetrics: computePerformanceMetrics(892),
    ai_interpretation:
      'Your profile suggests strong memory and logical reasoning within a CHC framework, you tend to hold information steady and apply rules deliberately when problems are unfamiliar. Pattern and spatial recognition offer the most room to grow; short, varied visual drills can complement what you already do well. One practical insight: pairing your logic strengths with targeted pattern practice often produces the fastest overall gains.',
  };
}
