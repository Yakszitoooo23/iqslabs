'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ensureAuthFromUrl } from '@/lib/authCallback';
import { getSupabase } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const ok = await ensureAuthFromUrl();
      if (!ok) {
        const {
          data: { session },
        } = await getSupabase().auth.getSession();
        if (!session) {
          setError('Sign-in link expired or invalid. Please request a new results email.');
          return;
        }
      }
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
      router.replace(safeNext);
    }

    run().catch(() => {
      setError('Sign-in link expired or invalid. Please request a new one.');
    });
  }, [next, router]);

  if (error) {
    return (
      <main className="p-12 text-center space-y-4">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return <main className="p-12 text-center text-slate-500">Signing you in…</main>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="p-12 text-center text-slate-500">Signing you in…</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
