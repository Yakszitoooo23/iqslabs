import { NextRequest, NextResponse } from 'next/server';
import { sendTrialEndingEmail } from '@/lib/email';
import { getStripe } from '@/lib/stripe';
import {
  subscriptionPeriodEndIso,
  subscriptionToProfileUpdate,
  syncProfileSubscriptionFromStripe,
} from '@/lib/syncSubscription';
import { getServiceSupabase } from '@/lib/supabase';
import { fulfillCheckoutSession } from '@/lib/checkoutFulfillment';
import Stripe from 'stripe';

async function updateProfileForSubscription(
  supabase: ReturnType<typeof getServiceSupabase>,
  sub: Stripe.Subscription,
): Promise<void> {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
  if (!customerId) {
    console.error('Subscription event missing customer id', sub.id);
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update(subscriptionToProfileUpdate(sub))
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Failed to update profile for subscription', sub.id, error.message);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Webhook signature failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email =
          session.customer_details?.email ?? session.customer_email ?? null;
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id;

        if (!email || !customerId) {
          console.error('checkout.session.completed missing email or customer', session.id);
          break;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const pendingToken = session.metadata?.pending_token ?? null;

        await fulfillCheckoutSession(supabase, {
          email: normalizedEmail,
          customerId,
          pendingToken,
        });

        await syncProfileSubscriptionFromStripe(supabase, stripe, customerId);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        await updateProfileForSubscription(supabase, sub);
        console.log(
          'Subscription synced:',
          sub.id,
          sub.status,
          'cancel_at_period_end=',
          subscriptionToProfileUpdate(sub).cancel_at_period_end,
        );
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const sub = event.data.object as Stripe.Subscription;
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, stripe_customer_id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();

        if (profile?.email && profile.stripe_customer_id) {
          try {
            const portalSession = await stripe.billingPortal.sessions.create({
              customer: profile.stripe_customer_id,
              return_url: `${appUrl}/dashboard`,
            });

            const trialEndUnix = sub.trial_end ?? sub.current_period_end;
            if (!trialEndUnix) break;

            await sendTrialEndingEmail({
              email: profile.email,
              trialEndDate: new Date(trialEndUnix * 1000),
              manageSubscriptionLink: portalSession.url,
            });
          } catch (err) {
            console.error('Failed to send trial ending email:', err);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
        if (!customerId) break;

        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            cancel_at_period_end: false,
            current_period_end: subscriptionPeriodEndIso(sub),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Failed to mark subscription deleted', error.message);
          throw error;
        }
        break;
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook handler error';
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
