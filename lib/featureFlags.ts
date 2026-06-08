/**
 * Skip Stripe paywall and show unlocked scores.
 * Opt-in only, set NEXT_PUBLIC_SKIP_PAYWALL=true to enable test mode.
 */
export const SKIP_PAYWALL = process.env.NEXT_PUBLIC_SKIP_PAYWALL === 'true';

export const IS_DEV = process.env.NODE_ENV === 'development';
