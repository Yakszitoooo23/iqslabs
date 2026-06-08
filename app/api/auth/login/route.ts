import { NextRequest, NextResponse } from 'next/server';
import { createEmailMagicLink } from '@/lib/authConfirm';
import { sendLoginEmail } from '@/lib/email';
import { isPaidSubscription } from '@/lib/paidAccess';
import { getServiceSupabase } from '@/lib/supabase';

const GENERIC_SUCCESS =
  'If this email has a paid account, we sent a sign-in link. Check your inbox.';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';

    if (!rawEmail || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase();
    const supabase = getServiceSupabase();

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('email', email)
      .maybeSingle();

    if (!profile || !isPaidSubscription(profile.subscription_status)) {
      return NextResponse.json({ message: GENERIC_SUCCESS });
    }

    const signInLink = await createEmailMagicLink(supabase, email, '/dashboard');
    await sendLoginEmail({ email, signInLink });

    return NextResponse.json({ message: GENERIC_SUCCESS });
  } catch (err: unknown) {
    console.error('Login link error:', err);
    return NextResponse.json(
      { error: 'Could not send sign-in link. Please try again.' },
      { status: 500 },
    );
  }
}
