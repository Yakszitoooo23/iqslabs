export interface CheckoutVerifyResult {
  access_token: string;
  refresh_token: string;
  email: string;
  userId: string;
  fulfilled: boolean;
}

const inflight = new Map<string, Promise<CheckoutVerifyResult>>();
const completed = new Map<string, { result: CheckoutVerifyResult; expiresAt: number }>();

const CACHE_TTL_MS = 10 * 60 * 1000;

/** One verify per Stripe session, avoids duplicate magic links invalidating each other. */
export function runCheckoutVerifyOnce(
  sessionId: string,
  fn: () => Promise<CheckoutVerifyResult>,
): Promise<CheckoutVerifyResult> {
  const now = Date.now();
  const cached = completed.get(sessionId);
  if (cached && cached.expiresAt > now) {
    return Promise.resolve(cached.result);
  }

  const existing = inflight.get(sessionId);
  if (existing) return existing;

  const promise = fn()
    .then((result) => {
      completed.set(sessionId, { result, expiresAt: Date.now() + CACHE_TTL_MS });
      return result;
    })
    .finally(() => {
      inflight.delete(sessionId);
    });

  inflight.set(sessionId, promise);
  return promise;
}
