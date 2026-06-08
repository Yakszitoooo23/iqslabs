import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export function subscriptionPeriodEndIso(sub: Stripe.Subscription): string | null {
  const unix = sub.current_period_end ?? sub.trial_end ?? sub.cancel_at;
  if (!unix) return null;
  return new Date(unix * 1000).toISOString();
}

/** True when the subscription is set to end (portal cancel at period end). */
export function isSubscriptionScheduledToCancel(sub: Stripe.Subscription): boolean {
  if (sub.cancel_at_period_end) return true;
  if (sub.cancel_at != null) return true;
  if (sub.canceled_at != null && (sub.status === 'active' || sub.status === 'trialing')) {
    return true;
  }
  return false;
}

export function subscriptionToProfileUpdate(sub: Stripe.Subscription) {
  return {
    subscription_status: sub.status,
    cancel_at_period_end: isSubscriptionScheduledToCancel(sub),
    current_period_end: subscriptionPeriodEndIso(sub),
  };
}

export async function syncProfileSubscriptionFromStripe(
  supabase: SupabaseClient,
  stripe: Stripe,
  stripeCustomerId: string,
  profileId?: string,
): Promise<{ ok: boolean; error?: string }> {
  let list;
  try {
    list = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 10,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to list subscriptions';
    return { ok: false, error: message };
  }

  const sub =
    list.data.find((s) => s.status === 'active' || s.status === 'trialing') ??
    [...list.data].sort((a, b) => b.created - a.created)[0];

  const profileFilter = profileId
    ? { column: 'id' as const, value: profileId }
    : { column: 'stripe_customer_id' as const, value: stripeCustomerId };

  if (!sub) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        cancel_at_period_end: false,
      })
      .eq(profileFilter.column, profileFilter.value)
      .select('id');

    if (error) return { ok: false, error: error.message };
    if (!data?.length) return { ok: false, error: 'Profile not found for subscription sync' };
    return { ok: true };
  }

  const update = subscriptionToProfileUpdate(sub);
  const { data, error } = await supabase
    .from('profiles')
    .update(update)
    .eq(profileFilter.column, profileFilter.value)
    .select('id');

  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: 'Profile not found for subscription sync' };

  console.log('Subscription synced from Stripe:', {
    profileId: data[0].id,
    status: update.subscription_status,
    cancel_at_period_end: update.cancel_at_period_end,
  });

  return { ok: true };
}
