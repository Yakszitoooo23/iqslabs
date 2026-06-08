'use client';

import { LIKERT_LABELS } from '@/data/testStructure';
import { LikertOptionBar, QuestionShell } from './QuestionShell';

interface LikertStepProps {
  statement: string;
  labels?: readonly string[];
  prompt?: string;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}

export function LikertStep({
  statement,
  labels = LIKERT_LABELS,
  prompt = 'How much do you agree?',
  selectedIndex,
  onSelect,
  onContinue,
}: LikertStepProps) {
  return (
    <QuestionShell
      left={
        <>
          <p className="text-sm text-slate-600 uppercase tracking-wide">About you</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] leading-snug">{statement}</h2>
          <p className="text-slate-600 text-sm">There is no right or wrong answer.</p>
        </>
      }
      right={
        <>
          <p className="text-sm font-medium text-slate-600">{prompt}</p>
          <div className="space-y-3">
            {labels.map((label, i) => (
              <LikertOptionBar
                key={label}
                label={label}
                index={i}
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
