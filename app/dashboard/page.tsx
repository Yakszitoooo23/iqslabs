'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CustomerDashboard,
  getPreviewMockResult,
} from '@/components/dashboard/CustomerDashboard';
import { TEST_CONFIG } from '@/data/questions';
import { scoreMultiPhaseTest } from '@/lib/scoring';
import { computePerformanceMetrics } from '@/lib/performanceMetrics';
import { SKIP_PAYWALL } from '@/lib/featureFlags';
import { loadLocalTestResult, type LocalTestResult } from '@/lib/localResults';
import { getOrCreateLocalUserId } from '@/lib/referral';
import { ensureAuthFromUrl } from '@/lib/authCallback';
import { getSupabase } from '@/lib/supabase';
import { hasDashboardAccess, type SubscriptionInfo } from '@/lib/subscriptionUi';

interface TestResult {
  scaled_score: number;
  percentile: number;
  raw_score: number;
  answers: Record<string, number>;
  time_taken_seconds: number;
  completed_at: string;
  ai_interpretation: string | null;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  referral_code: string | null;
  subscription_status: string;
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
}

function supabaseToLocal(result: TestResult): LocalTestResult {
  const rawAnswers = result.answers ?? {};
  const parsed =
    typeof rawAnswers === 'object' &&
    rawAnswers !== null &&
    'stepAnswers' in rawAnswers
      ? {
          stepAnswers: (rawAnswers as { stepAnswers?: Record<string, number> }).stepAnswers ?? {},
          likertAnswers:
            (rawAnswers as { likertAnswers?: Record<string, number> }).likertAnswers ?? {},
          goalAnswers: (rawAnswers as { goalAnswers?: Record<string, number> }).goalAnswers ?? {},
          demographicAnswers:
            (rawAnswers as { demographicAnswers?: Record<string, number> }).demographicAnswers ??
            {},
        }
      : {
          stepAnswers: rawAnswers as Record<string, number>,
          likertAnswers: {},
          goalAnswers: {},
          demographicAnswers: {},
        };

  const timeTaken = result.time_taken_seconds ?? 0;
  const scored = scoreMultiPhaseTest(
    TEST_CONFIG.iq.steps,
    parsed,
    { timeTakenSeconds: timeTaken },
  );

  return {
    scaled_score: result.scaled_score,
    percentile: Number(result.percentile),
    raw_score: result.raw_score,
    category: scored.category,
    strengths: scored.strengths,
    weaknesses: scored.weaknesses,
    dimensionScores: scored.dimensionScores,
    time_taken_seconds: timeTaken,
    ai_interpretation: result.ai_interpretation,
    cognitiveProfile: scored.cognitiveProfile,
    stepAnswers: parsed.stepAnswers,
    performanceMetrics: computePerformanceMetrics(timeTaken),
  };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const isPaidPreview = searchParams.get('preview') === 'paid';
  const forceSample = searchParams.get('sample') === '1';
  const checkoutSessionId = searchParams.get('session_id');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [localResult, setLocalResult] = useState<LocalTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [authReady, setAuthReady] = useState(!checkoutSessionId);
  const [sessionReady, setSessionReady] = useState(false);
  const verifyStartedRef = useRef<string | null>(null);

  useEffect(() => {
    async function initSessionFromUrl() {
      await ensureAuthFromUrl();
      setSessionReady(true);
    }
    initSessionFromUrl();
  }, []);

  useEffect(() => {
    if (!checkoutSessionId || isPaidPreview) return;
    if (verifyStartedRef.current === checkoutSessionId) return;
    verifyStartedRef.current = checkoutSessionId;

    async function verifyCheckout() {
      try {
        const res = await fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: checkoutSessionId }),
        });
        const data = await res.json();

        if (!res.ok) {
          setCheckoutError(data.error ?? 'Could not verify payment');
          setAuthReady(true);
          return;
        }

        const { error: sessionError } = await getSupabase().auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) {
          setCheckoutError(sessionError.message);
          setAuthReady(true);
          return;
        }

        window.history.replaceState({}, '', '/dashboard');
      } catch {
        setCheckoutError('Could not verify payment');
      } finally {
        setAuthReady(true);
      }
    }

    verifyCheckout();
  }, [checkoutSessionId, isPaidPreview]);

  const loadProfileAndResults = useCallback(async () => {
    const supabase = getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      if (checkoutSessionId) {
        setCheckoutError('Payment received but sign-in failed. Please contact support.');
        setLoading(false);
        return;
      }
      window.location.href = '/login';
      return;
    }

    try {
      const syncRes = await fetch('/api/subscription/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!syncRes.ok) {
        const syncData = await syncRes.json().catch(() => ({}));
        console.error('Subscription sync failed:', syncData.error ?? syncRes.status);
      }
    } catch (err) {
      console.error('Subscription sync request failed:', err);
    }

    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    setProfile(p);

    const { data: r } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('test_type', 'iq')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
    setResult(r);

    setLoading(false);
  }, [checkoutSessionId]);

  useEffect(() => {
    if (!authReady || !sessionReady) return;

    async function load() {
      if (isPaidPreview) {
        setLocalResult(
          forceSample ? getPreviewMockResult() : (loadLocalTestResult() ?? getPreviewMockResult()),
        );
        setLoading(false);
        return;
      }

      if (SKIP_PAYWALL) {
        const local = loadLocalTestResult();
        if (local) {
          setLocalResult(local);
          setLoading(false);
          return;
        }
      }

      await loadProfileAndResults();
    }
    load();
  }, [forceSample, isPaidPreview, authReady, sessionReady, checkoutSessionId, loadProfileAndResults]);

  useEffect(() => {
    if (isPaidPreview || SKIP_PAYWALL) return;

    function onFocus() {
      if (document.visibilityState === 'visible') {
        loadProfileAndResults();
      }
    }

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isPaidPreview, loadProfileAndResults]);

  async function handleManageSubscription() {
    const supabase = getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    setManagingSubscription(true);
    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      console.error('Portal error:', data.error);
    } catch (err) {
      console.error('Portal request failed:', err);
    } finally {
      setManagingSubscription(false);
    }
  }

  function toSubscriptionInfo(p: Profile): SubscriptionInfo {
    return {
      status: p.subscription_status,
      currentPeriodEnd: p.current_period_end,
      cancelAtPeriodEnd: p.cancel_at_period_end ?? false,
    };
  }

  if (loading || !authReady || !sessionReady) {
    return (
      <main className="p-12 text-center text-slate-500">
        {checkoutSessionId ? 'Confirming your payment…' : 'Loading...'}
      </main>
    );
  }

  if (checkoutError) {
    return (
      <main className="p-12 text-center space-y-4">
        <p className="text-red-600">{checkoutError}</p>
        <Link href="/results" className="text-accent underline">
          Return to results
        </Link>
      </main>
    );
  }

  if (isPaidPreview && localResult) {
    return (
      <CustomerDashboard
        email="customer@example.com"
        result={localResult}
        showDevBanner={SKIP_PAYWALL}
        userId={getOrCreateLocalUserId()}
      />
    );
  }

  if (SKIP_PAYWALL && localResult) {
    return (
      <CustomerDashboard
        email="you@example.com"
        result={localResult}
        showDevBanner={SKIP_PAYWALL}
        userId={getOrCreateLocalUserId()}
      />
    );
  }

  if (result && profile) {
    const subscription = toSubscriptionInfo(profile);
    const hasAccess = hasDashboardAccess(subscription);

    return (
      <>
        {!hasAccess && (
          <div className="max-w-5xl mx-auto px-6 pt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
              Your subscription is inactive.{' '}
              <Link href="/results" className="underline font-medium">
                Reactivate
              </Link>
            </div>
          </div>
        )}
        <CustomerDashboard
          email={profile.email}
          result={supabaseToLocal(result)}
          subscription={subscription}
          onManageSubscription={handleManageSubscription}
          managingSubscription={managingSubscription}
          userId={profile.id}
          referralCode={profile.referral_code ?? undefined}
          fullName={profile.full_name}
        />
      </>
    );
  }

  return (
    <main className="p-12 text-center text-slate-500">
      No results yet. <Link href="/quiz" className="text-accent underline">Take the test</Link>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="p-12 text-center text-slate-500">Loading...</main>}>
      <DashboardContent />
    </Suspense>
  );
}
