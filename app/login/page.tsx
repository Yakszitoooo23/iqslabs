'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          window.location.href = '/dashboard';
        }
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      setMessage(data.message);
      setEmail('');
    } catch {
      setError('Could not send sign-in link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-heading">Member login</h1>
          <p className="text-slate-500">
            Enter the email you used at checkout. We&apos;ll send you a secure sign-in link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {loading ? 'Sending…' : 'Send sign-in link'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Haven&apos;t taken the test yet?{' '}
          <Link href="/quiz" className="text-accent underline">
            Start here
          </Link>
        </p>
      </div>
    </main>
  );
}
