'use client';

import Link from 'next/link';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import type { LocalTestResult } from '@/lib/localResults';
import { getOrCreateLocalUserId } from '@/lib/referral';

interface UnlockedReportProps {
  result: LocalTestResult;
  showDevBanner?: boolean;
  isSample?: boolean;
}

/** @deprecated Use CustomerDashboard directly, kept for backwards compatibility. */
export function UnlockedReport({
  result,
  showDevBanner = false,
  isSample = false,
}: UnlockedReportProps) {
  return (
    <>
      <CustomerDashboard
        email="you@example.com"
        result={result}
        showDevBanner={showDevBanner || isSample}
        userId={getOrCreateLocalUserId()}
      />
      <div className="max-w-5xl mx-auto px-6 pb-10 flex flex-wrap gap-4 justify-center">
        <Link
          href="/games"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Brain Training →
        </Link>
        <Link
          href="/quiz"
          className="inline-block text-slate-500 hover:text-blue-600 font-medium px-4 py-3"
        >
          Retake test
        </Link>
      </div>
    </>
  );
}
