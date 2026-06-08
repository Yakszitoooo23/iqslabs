import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export type MagicLinkType = 'magiclink' | 'signup';

export function buildEmailConfirmUrl(
  tokenHash: string,
  next = '/dashboard',
  type: MagicLinkType = 'magiclink',
): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    token_hash: tokenHash,
    next,
    type,
  });
  return `${appUrl}/auth/confirm?${params.toString()}`;
}

export async function createEmailMagicLink(
  supabase: SupabaseClient,
  email: string,
  next = '/dashboard',
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: normalizedEmail,
  });

  if (error || !data?.properties?.hashed_token) {
    throw error ?? new Error('Failed to create sign-in link');
  }

  const linkType: MagicLinkType =
    data.properties.verification_type === 'signup' ? 'signup' : 'magiclink';

  return buildEmailConfirmUrl(data.properties.hashed_token, next, linkType);
}

export async function verifyMagicTokenHash(
  tokenHash: string,
  type: MagicLinkType = 'magiclink',
): Promise<{ access_token: string; refresh_token: string; email: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase public env vars are not configured');
  }

  const anonClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await anonClient.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error || !data.session) {
    throw error ?? new Error('Invalid or expired sign-in link');
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    email: data.session.user.email ?? '',
  };
}
