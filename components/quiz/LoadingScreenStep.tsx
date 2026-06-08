'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenStepProps {
  messages: string[];
  durationMs: number;
  onComplete: () => void;
}

export function LoadingScreenStep({ messages, durationMs, onComplete }: LoadingScreenStepProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = durationMs / (messages.length + 1);
    const timers = messages.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), interval * (i + 1)),
    );
    const done = setTimeout(onComplete, durationMs);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [messages, durationMs, onComplete]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-14 text-center space-y-10">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
          Calculating your cognitive profile...
        </h2>
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin mx-auto" />
      </div>

      <ul className="space-y-4 text-left max-w-md mx-auto">
        {messages.map((msg, i) => {
          const done = i < visibleCount;
          return (
            <li
              key={msg}
              className={`flex items-center gap-3 text-lg transition-opacity duration-500 ${
                done ? 'opacity-100 text-[#0F172A]' : 'opacity-30 text-slate-400'
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  done ? 'bg-accent text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {done ? '✓' : '·'}
              </span>
              {msg}
              {done && i === visibleCount - 1 && visibleCount < messages.length && (
                <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse ml-1" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
