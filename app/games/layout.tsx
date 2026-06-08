'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) {
          router.replace('/login');
          return;
        }
        setReady(true);
      });
  }, [router]);

  if (!ready) {
    return (
      <main className="p-12 text-center text-slate-500">Loading…</main>
    );
  }

  return children;
}
