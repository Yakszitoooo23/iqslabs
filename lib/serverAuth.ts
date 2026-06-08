import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { getServiceSupabase } from '@/lib/supabase';

export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const jwt = authHeader.slice(7);
  const { data, error } = await getServiceSupabase().auth.getUser(jwt);
  if (error || !data.user) return null;
  return data.user;
}
