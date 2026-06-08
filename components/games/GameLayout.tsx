import Link from 'next/link';
import { ReactNode } from 'react';

interface GameLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function GameLayout({
  title,
  subtitle,
  children,
  backHref = '/games',
  backLabel = '← Back to games',
}: GameLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start gap-4 mb-8">
          <div>
            <Link
              href={backHref}
              className="text-sm text-slate-500 hover:text-[#2563EB] transition mb-2 inline-block"
            >
              {backLabel}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">{title}</h1>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

interface GameResultProps {
  correct: number;
  total: number;
  rating: string;
  onPlayAgain: () => void;
  backHref?: string;
}

export function GameResult({
  correct,
  total,
  rating,
  onPlayAgain,
  backHref = '/games',
}: GameResultProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10 text-center space-y-6">
      <p className="text-slate-500 uppercase tracking-wide text-sm">Results</p>
      <p className="text-4xl md:text-5xl font-bold text-[#0F172A]">
        You got {correct} out of {total}
      </p>
      <p className="text-2xl text-[#2563EB] font-semibold">{pct}%</p>
      <p className="text-lg text-slate-700">{rating}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          type="button"
          onClick={onPlayAgain}
          className="px-8 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl transition"
        >
          Play Again
        </button>
        <Link
          href={backHref}
          className="px-8 py-3 border border-slate-200 hover:border-[#2563EB] text-[#0F172A] font-semibold rounded-xl transition text-center"
        >
          Back to Games
        </Link>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition ${className}`}
    >
      {children}
    </button>
  );
}
