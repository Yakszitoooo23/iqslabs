import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { runCheckoutVerifyOnce } from '@/lib/checkoutVerifyDedup';
import { getStripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import type { PendingScoreData } from '@/lib/checkoutFulfillment';
import {
  createSessionForEmail,
  fulfillCheckoutSession,
} from '@/lib/checkoutFulfillment';
import { sendCheckoutResultsEmail } from '@/lib/postCheckoutEmail';

const CHECKOUT_VERIFY_COOKIE = 'checkout_verify_nonce';

function getCookieSigningSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || null;
}

function parseSignedCheckoutNonce(value: string, secret: string): string | null {
  const dot = value.lastIndexOf('.');
  if (dot === -1) return null;

  const nonce = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expected = createHmac('sha256', secret).update(nonce).digest('hex');

  try {
    if (signature.length !== expected.length) return null;
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    return nonce;
  } catch {
    return null;
  }
}

function checkoutVerifyNonceMatches(req: NextRequest, sessionNonce: string | undefined): boolean {
  if (!sessionNonce) return false;

  const secret = getCookieSigningSecret();
  const cookieValue = req.cookies.get(CHECKOUT_VERIFY_COOKIE)?.value;
  if (!secret || !cookieValue) return false;

  const nonce = parseSignedCheckoutNonce(cookieValue, secret);
  if (!nonce) return false;

  try {
    if (nonce.length !== sessionNonce.length) return false;
    return timingSafeEqual(Buffer.from(nonce), Buffer.from(sessionNonce));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId);

    if (!checkoutVerifyNonceMatches(req, stripeSession.metadata?.verify_nonce)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const payload = await runCheckoutVerifyOnce(sessionId, async () => {
      if (stripeSession.status !== 'complete') {
        throw new Error('Checkout not completed');
      }

      const email =
        stripeSession.customer_details?.email ??
        stripeSession.customer_email ??
        null;

      if (!email) {
        throw new Error('No customer email on session');
      }

      const customerId =
        typeof stripeSession.customer === 'string'
          ? stripeSession.customer
          : stripeSession.customer?.id;

      if (!customerId) {
        throw new Error('No Stripe customer on session');
      }

      const supabase = getServiceSupabase();
      const normalizedEmail = email.trim().toLowerCase();
      const pendingToken = stripeSession.metadata?.pending_token ?? null;

      let pending: {
        score_data: PendingScoreData;
        ai_interpretation: string | null;
      } | null = null;

      if (pendingToken) {
        const { data } = await supabase
          .from('pending_results')
          .select('score_data, ai_interpretation')
          .eq('token', pendingToken)
          .maybeSingle();
        pending = data;
      }

      const { userId, fulfilled } = await fulfillCheckoutSession(supabase, {
        email: normalizedEmail,
        customerId,
        pendingToken,
      });

      // Sign in the browser first, verifying a magic link invalidates any earlier links
      // for the same user, so the results email must be generated after this step.
      const authSession = await createSessionForEmail(supabase, normalizedEmail);

      try {
        await sendCheckoutResultsEmail(supabase, {
          email: normalizedEmail,
          userId,
          pending,
        });
      } catch (emailErr) {
        console.error('Results email failed after checkout verify:', emailErr);
      }

      return {
        access_token: authSession.access_token,
        refresh_token: authSession.refresh_token,
        email: authSession.email,
        userId,
        fulfilled,
      };
    });

    const response = NextResponse.json(payload);
    response.cookies.set(CHECKOUT_VERIFY_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    console.error('Checkout verify error:', err);
    const status =
      message === 'Checkout not completed' ||
      message === 'No customer email on session' ||
      message === 'No Stripe customer on session'
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
