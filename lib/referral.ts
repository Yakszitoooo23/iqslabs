/** Derive an 8-char referral code from a user UUID (deterministic fallback). */
export function referralCodeFromUserId(userId: string): string {
  if (typeof window !== 'undefined') {
    return btoa(userId)
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toLowerCase();
  }
  return Buffer.from(userId)
    .toString('base64url')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 8)
    .toLowerCase();
}

export function buildReferralLink(referralCode: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== 'undefined' ? window.location.origin : 'https://iqslabs.com');
  return `${base}/?ref=${referralCode}`;
}

export const REFERRAL_COOKIE = 'referral_ref';

export function setReferralCookie(ref: string): void {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(ref)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

const LOCAL_USER_KEY = 'local_user_id';

/** Stable anonymous ID for referral links in dev / skip-paywall mode. */
export function getOrCreateLocalUserId(): string {
  if (typeof window === 'undefined') return 'local-preview-user';
  let id = sessionStorage.getItem(LOCAL_USER_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `local-${Date.now()}`;
    sessionStorage.setItem(LOCAL_USER_KEY, id);
  }
  return id;
}
