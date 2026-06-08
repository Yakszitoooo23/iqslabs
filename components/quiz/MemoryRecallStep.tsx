'use client';

import { MintOptionBar, QuestionShell } from './QuestionShell';

interface MemoryRecallStepProps {
  question: string;
  options: string[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}

export function MemoryRecallStep({
  question,
  options,
  selectedIndex,
  onSelect,
  onContinue,
}: MemoryRecallStepProps) {
  return (
    <QuestionShell
      left={
        <>
          <p className="text-sm text-slate-600 uppercase tracking-wide">Memory recall</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] leading-snug">{question}</h2>
        </>
      }
      right={
        <>
          <p className="text-sm font-medium text-slate-600">Choose answer:</p>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <MintOptionBar
                key={i}
                label={opt}
                selected={selectedIndex === i}
                onClick={() => onSelect(i)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={selectedIndex === undefined}
            className="w-full mt-4 px-6 py-3 bg-accent hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl transition"
          >
            Continue
          </button>
        </>
      }
    />
  );
}
