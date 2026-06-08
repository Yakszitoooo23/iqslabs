import { Resend } from 'resend';
import { SUPPORT_EMAIL } from '@/lib/legal';

const DEFAULT_FROM = 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email send');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function resolveResultsFrom(): string {
  if (process.env.RESEND_FROM_RESULTS) {
    return process.env.RESEND_FROM_RESULTS;
  }
  if (process.env.RESEND_FROM_EMAIL) {
    console.warn('RESEND_FROM_RESULTS not set, falling back to RESEND_FROM_EMAIL');
    return process.env.RESEND_FROM_EMAIL;
  }
  console.warn('RESEND_FROM_RESULTS not set, using default onboarding@resend.dev');
  return DEFAULT_FROM;
}

function resolveLoginFrom(): string {
  if (process.env.RESEND_FROM_LOGIN) {
    return process.env.RESEND_FROM_LOGIN;
  }
  if (process.env.RESEND_FROM_EMAIL) {
    console.warn('RESEND_FROM_LOGIN not set, falling back to RESEND_FROM_EMAIL');
    return process.env.RESEND_FROM_EMAIL;
  }
  console.warn('RESEND_FROM_LOGIN not set, using default onboarding@resend.dev');
  return DEFAULT_FROM;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface ResultsEmailParams {
  email: string;
  iqScore: number;
  percentile: number;
  classification: string;
  strengths: string[];
  weaknesses: string[];
  aiInterpretation: string;
  magicLink: string;
}

export async function sendResultsEmail(params: ResultsEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const {
    email,
    iqScore,
    percentile,
    classification,
    strengths,
    weaknesses,
    aiInterpretation,
    magicLink,
  } = params;

  const safeClassification = escapeHtml(classification);
  const safeInterpretation = escapeHtml(aiInterpretation);
  const topPercent = Math.max(1, Math.round(100 - percentile));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your IQ Test Results</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
          <tr>
            <td style="padding:32px 32px 16px;text-align:center;">
              <h1 style="margin:0;font-size:24px;color:#2563eb;font-weight:700;">Your IQ Results Are Ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <div style="background:#f8fafc;border-radius:12px;padding:32px;text-align:center;">
                <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your IQ Score</div>
                <div style="font-size:72px;color:#2563eb;font-weight:700;line-height:1;">${iqScore}</div>
                <div style="font-size:16px;color:#475569;margin-top:8px;">${safeClassification}</div>
                <div style="font-size:14px;color:#64748b;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;">
                  You ranked in the <strong style="color:#2563eb;">top ${topPercent}%</strong> of test takers
                </div>
              </div>
            </td>
          </tr>
          ${
            strengths.length > 0
              ? `
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 12px;font-size:18px;color:#059669;">Your Strengths</h2>
              <ul style="margin:0;padding-left:20px;color:#334155;font-size:15px;line-height:1.6;">
                ${strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
              </ul>
            </td>
          </tr>
          `
              : ''
          }
          ${
            weaknesses.length > 0
              ? `
          <tr>
            <td style="padding:16px 32px 0;">
              <h2 style="margin:0 0 12px;font-size:18px;color:#2563eb;">Growth Areas</h2>
              <ul style="margin:0;padding-left:20px;color:#334155;font-size:15px;line-height:1.6;">
                ${weaknesses.map((w) => `<li>${escapeHtml(w)}</li>`).join('')}
              </ul>
            </td>
          </tr>
          `
              : ''
          }
          ${
            aiInterpretation
              ? `
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">Your Personalized Analysis</h2>
              <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">${safeInterpretation}</p>
            </td>
          </tr>
          `
              : ''
          }
          <tr>
            <td style="padding:32px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${magicLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:600;font-size:16px;">View Your Full Report →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;text-align:center;font-size:13px;color:#94a3b8;">
                Includes detailed dimension breakdowns, brain training games, and your personalized cognitive profile.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
              <p style="margin:0;">You received this because you completed the IQ assessment.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const { data, error } = await resend.emails.send({
    from: resolveResultsFrom(),
    to: email,
    replyTo: SUPPORT_EMAIL,
    subject: `Your IQ Score: ${iqScore} (${classification})`,
    html,
  });

  if (error) {
    console.error('Resend API error (results email):', error);
    throw new Error(error.message);
  }

  console.log('Resend results email queued:', data?.id, '→', email);
}

export interface LoginEmailParams {
  email: string;
  signInLink: string;
}

export async function sendLoginEmail(params: LoginEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const { email, signInLink } = params;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign in to your account</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:16px;max-width:600px;">
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:24px;color:#0f172a;font-weight:700;">Sign in to your report</h1>
              <p style="margin:0 0 24px;font-size:16px;color:#334155;line-height:1.6;">
                Click the button below to open your IQ dashboard. This link expires soon and can only be used once.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${signInLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:600;font-size:16px;">Sign in to dashboard →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const { data, error } = await resend.emails.send({
    from: resolveLoginFrom(),
    to: email,
    replyTo: SUPPORT_EMAIL,
    subject: 'Your sign-in link',
    html,
  });

  if (error) {
    console.error('Resend API error (login email):', error);
    throw new Error(error.message);
  }

  console.log('Resend login email queued:', data?.id, '→', email);
}

export interface TrialEndingEmailParams {
  email: string;
  trialEndDate: Date;
  manageSubscriptionLink: string;
}

export async function sendTrialEndingEmail(params: TrialEndingEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const { email, trialEndDate, manageSubscriptionLink } = params;
  const formattedDate = trialEndDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:16px;max-width:600px;">
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:24px;color:#0f172a;font-weight:700;">Your trial ends in 3 days</h1>
              <p style="margin:0 0 16px;font-size:16px;color:#334155;line-height:1.6;">
                Your 7-day trial of IQ Test Premium ends on <strong>${formattedDate}</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#334155;line-height:1.6;">
                After this, you'll be charged <strong>$24.99/month</strong> to continue access to your full cognitive report, brain training games, and detailed analytics.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
                <tr>
                  <td align="center" style="padding:0 8px 8px 0;">
                    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:600;font-size:15px;">Continue Subscription</a>
                  </td>
                  <td align="center" style="padding:0 0 8px 8px;">
                    <a href="${manageSubscriptionLink}" style="display:inline-block;background:#ffffff;color:#475569;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:600;font-size:15px;border:1px solid #cbd5e1;">Cancel Subscription</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
                You can cancel anytime before ${formattedDate} to avoid being charged. Cancellation takes one click.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
              <p style="margin:0;">Manage your subscription anytime at ${APP_URL}/dashboard</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const { data, error } = await resend.emails.send({
    from: resolveLoginFrom(),
    to: email,
    replyTo: SUPPORT_EMAIL,
    subject: 'Your trial ends in 3 days',
    html,
  });

  if (error) {
    console.error('Resend API error (trial email):', error);
    throw new Error(error.message);
  }

  console.log('Resend trial email queued:', data?.id, '→', email);
}
