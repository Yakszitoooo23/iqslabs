import Link from 'next/link';
import { BRAIN_GAMES } from '@/lib/gamesCatalog';

export function BrainGamesSection() {
  return (
    <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Brain training games</h2>
        <p className="text-slate-500 text-sm">
          Sharpen memory, speed, and logic with daily practice.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {BRAIN_GAMES.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group border border-slate-200 rounded-xl p-5 hover:border-accent hover:shadow-sm transition"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-accent transition">
              {game.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{game.description}</p>
            <span className="inline-block mt-3 text-sm font-medium text-accent">Play →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
