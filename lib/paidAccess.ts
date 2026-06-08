const PAID_STATUSES = new Set(['active', 'trialing']);

export function isPaidSubscription(status: string | null | undefined): boolean {
  return !!status && PAID_STATUSES.has(status);
}
