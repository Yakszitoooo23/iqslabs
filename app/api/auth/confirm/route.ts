import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicTokenHash, type MagicLinkType } from '@/lib/authConfirm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tokenHash = typeof body.token_hash === 'string' ? body.token_hash : '';
    const type: MagicLinkType =
      body.type === 'signup' ? 'signup' : 'magiclink';

    if (!tokenHash) {
      return NextResponse.json({ error: 'token_hash required' }, { status: 400 });
    }

    const session = await verifyMagicTokenHash(tokenHash, type);
    return NextResponse.json(session);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sign-in failed';
    console.error('Auth confirm error:', err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
