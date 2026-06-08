'use client';

import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { MagicLinkType } from '@/lib/authConfirm';
import { getSupabase } from '@/lib/supabase';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const tokenHash = searchParams.get('token_hash');
  const type: MagicLinkType =
    searchParams.get('type') === 'signup' ? 'signup' : 'magiclink';

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openReport = useCallback(async () => {
    if (!tokenHash) {
      setError('This sign-in link is invalid.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_hash: tokenHash, type }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'This sign-in link expired. Complete checkout again for a new email.');
        return;
      }

      const { error: sessionError } = await getSupabase().auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
      router.replace(safeNext);
    } catch {
      setError('Could not sign you in. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [next, router, tokenHash, type]);

  if (!tokenHash) {
    return (
      <main className="p-12 text-center space-y-4 max-w-md mx-auto">
        <p className="text-red-600">This sign-in link is invalid.</p>
        <Link href="/" className="text-accent underline">
          Return home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-heading">Your report is ready</h1>
        <p className="text-slate-500">
          Click below to sign in and view your full IQ report, cognitive profile, and certificate.
        </p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="button"
          onClick={openReport}
          disabled={loading}
          className="w-full bg-accent hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
        >
          {loading ? 'Opening…' : 'View my full report →'}
        </button>
      </div>
    </main>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={<main className="p-12 text-center text-slate-500">Loading…</main>}>
      <AuthConfirmContent />
    </Suspense>
  );
}
