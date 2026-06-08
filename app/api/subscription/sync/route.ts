import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverAuth';
import { getStripe } from '@/lib/stripe';
import { syncProfileSubscriptionFromStripe } from '@/lib/syncSubscription';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    const result = await syncProfileSubscriptionFromStripe(
      supabase,
      getStripe(),
      profile.stripe_customer_id,
      user.id,
    );

    if (!result.ok) {
      console.error('Subscription sync failed:', result.error);
      return NextResponse.json({ error: result.error ?? 'Sync failed' }, { status: 500 });
    }

    const { data: updated } = await supabase
      .from('profiles')
      .select('subscription_status, cancel_at_period_end, current_period_end')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ profile: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    console.error('Subscription sync error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
