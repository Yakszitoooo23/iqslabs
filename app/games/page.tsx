'use client';

import Link from 'next/link';
import { BRAIN_GAMES } from '@/lib/gamesCatalog';

const GAME_ICONS: Record<string, JSX.Element> = {
  '/games/reaction': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  '/games/memory': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  '/games/iq-practice': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
  ),
  '/games/brain-teaser': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
      />
    </svg>
  ),
};

export default function GamesMenuPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <div className="flex justify-between items-start gap-4 mb-10">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-[#2563EB] transition mb-2 inline-block"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#0F172A]">Brain Training</h1>
            <p className="text-slate-500 mt-2">
              Choose a game to sharpen your cognitive performance
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {BRAIN_GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="group bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:border-[#2563EB] hover:shadow-md transition flex flex-col"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                {GAME_ICONS[game.href]}
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">{game.title}</h2>
              <p className="text-slate-500 text-sm flex-1 mb-4">{game.description}</p>
              <span className="inline-flex items-center text-[#2563EB] font-semibold text-sm group-hover:underline">
                Play →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
