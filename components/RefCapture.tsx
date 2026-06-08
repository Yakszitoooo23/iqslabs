'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { setReferralCookie } from '@/lib/referral';

/** Stores ?ref= from landing URL in a cookie for future attribution. */
export function RefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCookie(ref);
  }, [searchParams]);

  return null;
}
