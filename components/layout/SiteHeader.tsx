'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/copy';
import { getSupabase } from '@/lib/supabase';

function ProfileIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function isGamesRoute(pathname: string): boolean {
  return pathname === '/games' || pathname.startsWith('/games/');
}

function isDashboardRoute(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

export function SiteHeader() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const onHome = pathname === '/';
  const onGames = isGamesRoute(pathname);
  const onDashboard = isDashboardRoute(pathname);

  let memberNav: { href: string; label: string } | null = null;
  if (signedIn && !onHome) {
    if (onGames) memberNav = { href: '/dashboard', label: 'Results' };
    else if (onDashboard) memberNav = { href: '/games', label: 'Brain games' };
  }

  const showLogin = !signedIn;

  async function handleLogout() {
    await getSupabase().auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="border-b border-divider bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-heading">
          {BRAND}
        </Link>

        <div className="flex items-center gap-3">
          {signedIn === null ? (
            <span className="w-24 h-9" aria-hidden />
          ) : (
            <>
              {memberNav ? (
                <Link
                  href={memberNav.href}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-white hover:bg-blue-700 transition"
                >
                  {memberNav.label}
                </Link>
              ) : showLogin ? (
                <Link
                  href="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-white hover:bg-blue-700 transition"
                >
                  Log in
                </Link>
              ) : null}

              {signedIn && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-divider text-slate-600 hover:bg-subtle hover:text-heading transition"
                  >
                    <ProfileIcon />
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-heading px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  >
                    Logout
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
