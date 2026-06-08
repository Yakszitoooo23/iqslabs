'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { COOKIE_CONSENT_KEY } from '@/lib/legal';

type ConsentChoice = 'all' | 'essential';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function saveChoice(choice: ConsentChoice) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Ignore storage errors; hide banner anyway.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(15,23,42,0.08)]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">
          We use essential cookies to make this site work, plus analytics cookies to improve our
          service. You can accept all or only essential.{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline whitespace-nowrap">
            Privacy policy
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => saveChoice('essential')}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => saveChoice('all')}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
