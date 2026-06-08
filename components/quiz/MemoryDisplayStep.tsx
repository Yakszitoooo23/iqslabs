'use client';

import { useEffect, useState } from 'react';
import { QuestionShell } from './QuestionShell';

interface MemoryDisplayStepProps {
  sequence: string;
  displayMs: number;
  onComplete: () => void;
}

export function MemoryDisplayStep({ sequence, displayMs, onComplete }: MemoryDisplayStepProps) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(displayMs / 1000));

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const done = setTimeout(onComplete, displayMs);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [displayMs, onComplete]);

  return (
    <QuestionShell
      fullWidth
      left={
        <div className="text-center space-y-8 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A]">
            Remember this number sequence
          </h2>
          <div className="inline-block px-10 py-8 bg-[#F1F5F9] rounded-2xl">
            <p className="text-4xl md:text-5xl font-mono font-bold tracking-[0.3em] text-[#0F172A]">
              {sequence}
            </p>
          </div>
          <p className="text-slate-600">
            Disappears in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}
          </p>
        </div>
      }
    />
  );
}
