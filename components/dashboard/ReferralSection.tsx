'use client';

import { useCallback, useState } from 'react';
import { buildReferralLink } from '@/lib/referral';

interface ReferralSectionProps {
  referralCode: string;
}

export function ReferralSection({ referralCode }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = buildReferralLink(referralCode);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [referralLink]);

  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Invite your friends 🎉</h2>
      <p className="text-slate-600 text-sm mb-4">
        Curious about your friends&apos; IQ? Share this link and get their results in your inbox!
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm"
          aria-label="Your referral link"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
          aria-label="Copy referral link"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {copied && (
        <p className="absolute bottom-4 right-6 text-xs text-emerald-600 font-medium">
          Copied to clipboard!
        </p>
      )}
    </section>
  );
}
