import { getSupabase } from '@/lib/supabase';

/** Exchange PKCE codes or hash tokens left by Supabase redirect links (legacy). */
export async function ensureAuthFromUrl(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const supabase = getSupabase();
  const url = new URL(window.location.href);

  const tokenHash = url.searchParams.get('token_hash');
  if (tokenHash) {
    const type = url.searchParams.get('type') === 'signup' ? 'signup' : 'magiclink';
    const res = await fetch('/api/auth/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_hash: tokenHash, type }),
    });
    const data = await res.json();
    if (!res.ok) return false;

    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    if (error) return false;
    window.history.replaceState({}, '', url.pathname);
    return true;
  }

  const code = url.searchParams.get('code');
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      console.error('Auth code exchange failed:', error);
      return false;
    }
    window.history.replaceState({}, '', url.pathname);
    return true;
  }

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      console.error('Auth hash session failed:', error);
      return false;
    }
    window.history.replaceState({}, '', url.pathname);
    return true;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}
