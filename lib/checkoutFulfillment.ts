import { randomBytes } from 'crypto';
import { type SupabaseClient } from '@supabase/supabase-js';
import { verifyMagicTokenHash } from '@/lib/authConfirm';

export interface PendingScoreData {
  rawScore?: number;
  scaledScore?: number;
  percentile?: number;
  category?: string;
  classification?: string;
  strengths?: string[];
  weaknesses?: string[];
  answers?: Record<string, number>;
  likertAnswers?: Record<string, number>;
  goalAnswers?: Record<string, number>;
  demographicAnswers?: Record<string, number>;
  timeSeconds?: number;
  aiInterpretation?: string;
}

function generateReferralCode(): string {
  return randomBytes(6).toString('base64url').slice(0, 8);
}

function mergeAnswers(scoreData: PendingScoreData): Record<string, unknown> {
  return {
    stepAnswers: scoreData.answers ?? {},
    likertAnswers: scoreData.likertAnswers ?? {},
    goalAnswers: scoreData.goalAnswers ?? {},
    demographicAnswers: scoreData.demographicAnswers ?? {},
  };
}

export async function fulfillCheckoutSession(
  supabase: SupabaseClient,
  params: {
    email: string;
    customerId: string;
    pendingToken?: string | null;
  },
): Promise<{ userId: string; fulfilled: boolean }> {
  const email = params.email.trim().toLowerCase();
  const { customerId, pendingToken } = params;

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, referral_code')
    .eq('email', email)
    .maybeSingle();

  let userId = existing?.id;

  if (!userId) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (authErr) throw authErr;
    userId = authData.user.id;

    await supabase.from('profiles').insert({
      id: userId,
      email,
      stripe_customer_id: customerId,
      subscription_status: 'trialing',
      referral_code: generateReferralCode(),
    });
  } else {
    const updates: Record<string, string> = {
      stripe_customer_id: customerId,
      subscription_status: 'trialing',
    };
    if (!existing?.referral_code) {
      updates.referral_code = generateReferralCode();
    }
    await supabase.from('profiles').update(updates).eq('id', userId);
  }

  let fulfilled = false;

  if (pendingToken && userId) {
    const { data: pending, error: pendingErr } = await supabase
      .from('pending_results')
      .select('*')
      .eq('token', pendingToken)
      .maybeSingle();

    if (pendingErr) {
      console.error('pending_results lookup error:', pendingErr);
    } else if (pending) {
      const { count: existingCount } = await supabase
        .from('test_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('test_type', 'iq');

      if ((existingCount ?? 0) > 0) {
        await supabase.from('pending_results').delete().eq('token', pendingToken);
        fulfilled = true;
      } else {
        const scoreData = pending.score_data as PendingScoreData;

        if (scoreData?.scaledScore != null) {
          const { error: insertErr } = await supabase.from('test_results').insert({
            user_id: userId,
            test_type: pending.test_type || 'iq',
            raw_score: scoreData.rawScore,
            scaled_score: scoreData.scaledScore,
            percentile: scoreData.percentile,
            answers: mergeAnswers(scoreData),
            time_taken_seconds: scoreData.timeSeconds,
            ai_interpretation: pending.ai_interpretation ?? scoreData.aiInterpretation ?? null,
          });

          if (insertErr) {
            console.error('test_results insert error:', insertErr);
          } else {
            await supabase.from('pending_results').delete().eq('token', pendingToken);
            fulfilled = true;
          }
        }
      }
    } else {
      const { count } = await supabase
        .from('test_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('test_type', 'iq');

      fulfilled = (count ?? 0) > 0;
    }
  }

  return { userId, fulfilled };
}

type SessionTokens = {
  access_token: string;
  refresh_token: string;
  email: string;
};

const sessionCreationLocks = new Map<string, Promise<SessionTokens>>();

export async function createSessionForEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<SessionTokens> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = sessionCreationLocks.get(normalizedEmail);
  if (existing) return existing;

  const promise = (async (): Promise<SessionTokens> => {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    if (error || !data?.properties?.hashed_token) {
      throw error ?? new Error('Failed to create auth session');
    }

    const otpType =
      data.properties.verification_type === 'signup' ? 'signup' : 'magiclink';

    const session = await verifyMagicTokenHash(data.properties.hashed_token, otpType);

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      email: normalizedEmail,
    };
  })().finally(() => {
    sessionCreationLocks.delete(normalizedEmail);
  });

  sessionCreationLocks.set(normalizedEmail, promise);
  return promise;
}

/** @deprecated Prefer createSessionForEmail, returns tokens for setSession. */
export async function createSessionTokenForEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<{ token_hash: string; email: string }> {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: email.trim().toLowerCase(),
  });

  if (error || !data?.properties?.hashed_token) {
    throw error ?? new Error('Failed to create auth session');
  }

  return {
    token_hash: data.properties.hashed_token,
    email: email.trim().toLowerCase(),
  };
}
