'use client';

import {
  getSubscriptionDisplay,
  type SubscriptionInfo,
} from '@/lib/subscriptionUi';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  onManageSubscription?: () => void;
  managingSubscription?: boolean;
}

export function SubscriptionStatusBanner({
  subscription,
  onManageSubscription,
  managingSubscription,
}: SubscriptionStatusProps) {
  const display = getSubscriptionDisplay(subscription);
  if (display.kind !== 'banner') return null;

  const styles =
    display.tone === 'red'
      ? 'bg-red-50 border-red-200 text-red-900'
      : 'bg-amber-50 border-amber-200 text-amber-900';

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}>
      <p>
        {display.message}
        {display.showPortalLink && onManageSubscription && (
          <>
            {' '}
            <button
              type="button"
              onClick={onManageSubscription}
              disabled={managingSubscription}
              className="font-semibold underline hover:no-underline disabled:opacity-60"
            >
              {managingSubscription ? 'Opening…' : 'Update payment method'}
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export function SubscriptionStatusBadge({ subscription }: { subscription: SubscriptionInfo }) {
  const display = getSubscriptionDisplay(subscription);
  if (display.kind !== 'badge') return null;

  const styles =
    display.tone === 'green'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : 'bg-blue-50 text-blue-800 border-blue-200';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {display.label}
    </span>
  );
}
