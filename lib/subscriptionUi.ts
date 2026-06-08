export interface SubscriptionInfo {
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export function formatSubscriptionDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function hasDashboardAccess(info: SubscriptionInfo): boolean {
  return info.status === 'active' || info.status === 'trialing';
}

export type SubscriptionDisplay =
  | { kind: 'banner'; tone: 'yellow' | 'red'; message: string; showPortalLink?: boolean }
  | { kind: 'badge'; tone: 'green' | 'blue'; label: string }
  | { kind: 'inactive' };

export function getSubscriptionDisplay(info: SubscriptionInfo): SubscriptionDisplay {
  const endDate = formatSubscriptionDate(info.currentPeriodEnd);

  if (info.status === 'past_due') {
    return {
      kind: 'banner',
      tone: 'red',
      message: 'Payment failed. Please update your payment method.',
      showPortalLink: true,
    };
  }

  if (
    info.cancelAtPeriodEnd &&
    (info.status === 'active' || info.status === 'trialing')
  ) {
    return {
      kind: 'banner',
      tone: 'yellow',
      message: endDate
        ? `Your subscription is canceled and ends on ${endDate}. You still have access until then.`
        : 'Your subscription is canceled. You still have access until the end of your billing period.',
    };
  }

  if (info.status === 'trialing' && endDate) {
    return {
      kind: 'badge',
      tone: 'blue',
      label: `7-day trial, ends ${endDate}`,
    };
  }

  if (info.status === 'active') {
    return {
      kind: 'badge',
      tone: 'green',
      label: 'Active subscription',
    };
  }

  return { kind: 'inactive' };
}
