import { createHmac, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';

type PaymentMethodChoice = 'paypal' | 'google_pay' | 'card';

const CHECKOUT_VERIFY_COOKIE = 'checkout_verify_nonce';
const COOKIE_MAX_AGE_SEC = 3600;

function paymentTypesForMethod(
  method: PaymentMethodChoice,
): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  switch (method) {
    case 'paypal':
      return ['paypal', 'card'];
    case 'google_pay':
    case 'card':
    default:
      return ['card', 'paypal'];
  }
}

function requireEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function getCookieSigningSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || null;
}

function signCheckoutNonce(nonce: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(nonce).digest('hex');
  return `${nonce}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, scoreData, paymentMethod = 'card' } = await req.json();

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const appUrl = requireEnv('NEXT_PUBLIC_APP_URL');
    const priceId = requireEnv('STRIPE_PRICE_ID');
    const setupFeePriceId = requireEnv('STRIPE_SETUP_FEE_PRICE_ID');
    const cookieSecret = getCookieSigningSecret();

    if (!appUrl || !priceId || !setupFeePriceId) {
      const missing = [
        !appUrl && 'NEXT_PUBLIC_APP_URL',
        !priceId && 'STRIPE_PRICE_ID',
        !setupFeePriceId && 'STRIPE_SETUP_FEE_PRICE_ID',
      ].filter(Boolean);
      console.error('Missing Stripe or app env vars:', missing);
      return NextResponse.json(
        {
          error: `Checkout is not configured. Add ${missing.join(', ')} to .env.local and restart the dev server.`,
        },
        { status: 500 },
      );
    }

    if (!requireEnv('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY missing from .env.local' },
        { status: 500 },
      );
    }

    if (!cookieSecret) {
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY required for checkout verification' },
        { status: 500 },
      );
    }

    if (!scoreData?.scaledScore) {
      return NextResponse.json({ error: 'Score data required' }, { status: 400 });
    }

    const method = paymentMethod as PaymentMethodChoice;
    const supabase = getServiceSupabase();
    const trimmedEmail = email.trim().toLowerCase();
    const verifyNonce = randomBytes(32).toString('hex');

    const { data: pending, error: pendingError } = await supabase
      .from('pending_results')
      .insert({
        email: trimmedEmail,
        test_type: 'iq',
        score_data: scoreData,
        ai_interpretation: scoreData?.aiInterpretation || null,
      })
      .select('token')
      .single();

    if (pendingError || !pending?.token) {
      console.error('pending_results insert error:', pendingError);
      return NextResponse.json({ error: 'Failed to store results' }, { status: 500 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: paymentTypesForMethod(method),
      customer_email: trimmedEmail,
      line_items: [
        { price: setupFeePriceId, quantity: 1 },
        { price: priceId, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          test_type: 'iq',
          pending_token: pending.token,
          preferred_payment: method,
        },
      },
      metadata: {
        test_type: 'iq',
        pending_token: pending.token,
        preferred_payment: method,
        verify_nonce: verifyNonce,
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/results`,
    });

    const response = NextResponse.json({ url: session.url });
    response.cookies.set(CHECKOUT_VERIFY_COOKIE, signCheckoutNonce(verifyNonce, cookieSecret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_SEC,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    console.error('Checkout error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
