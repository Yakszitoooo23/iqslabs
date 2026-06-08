'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPreviewMockResult, CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { PaywallColumn, PaymentMethodChoice } from '@/components/results/PaywallColumn';
import { ReviewCarousel } from '@/components/results/ReviewCarousel';
import { SocialProofColumn } from '@/components/results/SocialProofColumn';
import { SKIP_PAYWALL } from '@/lib/featureFlags';
import { loadLocalTestResult, type LocalTestResult } from '@/lib/localResults';
import { getOrCreateLocalUserId } from '@/lib/referral';
import { loadSession } from '@/lib/quizSession';
import { scoreMultiPhaseTest } from '@/lib/scoring';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSample = searchParams.get('sample') === '1';

  const [email, setEmail] = useState('');
  const [loadingMethod, setLoadingMethod] = useState<PaymentMethodChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [localResult, setLocalResult] = useState<LocalTestResult | null>(null);

  useEffect(() => {
    if (isSample) {
      if (!SKIP_PAYWALL) {
        router.replace('/results');
        return;
      }
      setLocalResult(getPreviewMockResult());
      setReady(true);
      return;
    }

    const session = loadSession();
    if (!session) {
      router.push('/quiz');
      return;
    }

    if (SKIP_PAYWALL) {
      const stored = loadLocalTestResult();
      if (stored) {
        setLocalResult(stored);
      } else {
        const scored = scoreMultiPhaseTest(undefined, {
          stepAnswers: session.stepAnswers,
          likertAnswers: session.likertAnswers,
          goalAnswers: session.goalAnswers,
          demographicAnswers: session.demographicAnswers,
        });
        sessionStorage.setItem('score_result', JSON.stringify(scored));
        setLocalResult(loadLocalTestResult());
      }
    }

    setReady(true);
  }, [isSample, router]);

  async function handleCheckout(method: PaymentMethodChoice) {
    if (!email.trim()) return;

    const session = loadSession();
    if (!session) return;

    const result = scoreMultiPhaseTest(undefined, {
      stepAnswers: session.stepAnswers,
      likertAnswers: session.likertAnswers,
      goalAnswers: session.goalAnswers,
      demographicAnswers: session.demographicAnswers,
    });

    setLoadingMethod(method);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          paymentMethod: method,
          scoreData: {
            rawScore: result.rawScore,
            scaledScore: result.scaledScore,
            percentile: result.percentile,
            category: result.category,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            answers: session.stepAnswers,
            likertAnswers: session.likertAnswers,
            goalAnswers: session.goalAnswers,
            demographicAnswers: session.demographicAnswers,
            timeSeconds: Number(sessionStorage.getItem('quiz_time') || 0),
            aiInterpretation: sessionStorage.getItem('ai_interpretation') || '',
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingMethod(null);
      }
    } catch {
      setLoadingMethod(null);
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (SKIP_PAYWALL || isSample) {
    if (localResult) {
      return (
        <CustomerDashboard
          email="you@example.com"
          result={localResult}
          showDevBanner={SKIP_PAYWALL && !isSample}
          userId={getOrCreateLocalUserId()}
        />
      );
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <SocialProofColumn />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
            <PaywallColumn
              email={email}
              onEmailChange={setEmail}
              onCheckout={handleCheckout}
              loading={loadingMethod !== null}
              loadingMethod={loadingMethod}
            />
          </div>
        </div>
        <ReviewCarousel />
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white flex items-center justify-center"><p className="text-slate-500">Loading...</p></main>}>
      <ResultsContent />
    </Suspense>
  );
}
