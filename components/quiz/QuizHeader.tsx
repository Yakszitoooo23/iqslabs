'use client';

interface QuizHeaderProps {
  stepNumber: number;
  totalSteps: number;
  secondsRemaining: number;
  paused?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function QuizHeader({
  stepNumber,
  totalSteps,
  secondsRemaining,
  paused = false,
}: QuizHeaderProps) {
  const progress = totalSteps > 0 ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <header className="mb-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Question {stepNumber} of {totalSteps}
        </p>
        <p
          className={`text-sm font-mono font-medium tabular-nums ${
            paused ? 'text-blue-600' : 'text-slate-700'
          }`}
        >
          {paused ? 'Paused' : formatTime(secondsRemaining)}
        </p>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
