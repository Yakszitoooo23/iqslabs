import type { SupabaseClient } from '@supabase/supabase-js';
import { TEST_CONFIG } from '@/data/questions';
import type { PendingScoreData } from '@/lib/checkoutFulfillment';
import { createEmailMagicLink } from '@/lib/authConfirm';
import { sendResultsEmail } from '@/lib/email';
import { scoreMultiPhaseTest } from '@/lib/scoring';

async function buildMagicLink(
  supabase: SupabaseClient,
  email: string,
): Promise<string> {
  try {
    return await createEmailMagicLink(supabase, email, '/dashboard');
  } catch (linkErr) {
    console.error('Failed to generate magic link for results email:', linkErr);
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`;
  }
}

function parseSessionAnswers(raw: unknown): {
  stepAnswers: Record<string, number>;
  likertAnswers: Record<string, number>;
  goalAnswers: Record<string, number>;
  demographicAnswers: Record<string, number>;
} {
  if (typeof raw === 'object' && raw !== null && 'stepAnswers' in raw) {
    const a = raw as Record<string, unknown>;
    return {
      stepAnswers: (a.stepAnswers as Record<string, number>) ?? {},
      likertAnswers: (a.likertAnswers as Record<string, number>) ?? {},
      goalAnswers: (a.goalAnswers as Record<string, number>) ?? {},
      demographicAnswers: (a.demographicAnswers as Record<string, number>) ?? {},
    };
  }
  return {
    stepAnswers: (raw as Record<string, number>) ?? {},
    likertAnswers: {},
    goalAnswers: {},
    demographicAnswers: {},
  };
}

export async function sendCheckoutResultsEmail(
  supabase: SupabaseClient,
  params: {
    email: string;
    userId: string;
    pending?: {
      score_data: PendingScoreData;
      ai_interpretation: string | null;
    } | null;
  },
): Promise<boolean> {
  const normalizedEmail = params.email.trim().toLowerCase();
  let scoreData = params.pending?.score_data;
  let aiInterpretation =
    params.pending?.ai_interpretation ?? params.pending?.score_data?.aiInterpretation ?? '';

  if (!scoreData?.scaledScore) {
    const { data: result } = await supabase
      .from('test_results')
      .select('scaled_score, percentile, raw_score, answers, time_taken_seconds, ai_interpretation')
      .eq('user_id', params.userId)
      .eq('test_type', 'iq')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!result) {
      console.warn('sendCheckoutResultsEmail: no score data for', normalizedEmail);
      return false;
    }

    const parsed = parseSessionAnswers(result.answers);
    const scored = scoreMultiPhaseTest(
      TEST_CONFIG.iq.steps,
      parsed,
      { timeTakenSeconds: result.time_taken_seconds ?? 0 },
    );

    scoreData = {
      scaledScore: result.scaled_score,
      percentile: Number(result.percentile),
      category: scored.category,
      strengths: scored.strengths,
      weaknesses: scored.weaknesses,
      aiInterpretation: result.ai_interpretation ?? undefined,
    };
    aiInterpretation = result.ai_interpretation ?? aiInterpretation;
  }

  const magicLink = await buildMagicLink(supabase, normalizedEmail);

  try {
    await sendResultsEmail({
      email: normalizedEmail,
      iqScore: scoreData.scaledScore ?? 0,
      percentile: scoreData.percentile ?? 50,
      classification: scoreData.classification ?? scoreData.category ?? 'Average',
      strengths: scoreData.strengths ?? [],
      weaknesses: scoreData.weaknesses ?? [],
      aiInterpretation,
      magicLink,
    });
    console.log('Results email sent to', normalizedEmail);
    return true;
  } catch (emailErr) {
    console.error('Failed to send results email:', emailErr);
    return false;
  }
}
