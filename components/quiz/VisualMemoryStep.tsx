'use client';

import { useEffect, useMemo, useState } from 'react';
import type { VisualMemoryShape } from '@/data/patternTypes';
import { MintOptionBar, QuestionShell } from './QuestionShell';

const POSITION_LABELS: Record<number, string> = {
  0: 'top-left',
  1: 'top-center',
  2: 'top-right',
  3: 'middle-left',
  4: 'center',
  5: 'middle-right',
  6: 'bottom-left',
  7: 'bottom-center',
  8: 'bottom-right',
};

const SHAPE_LABELS: Record<VisualMemoryShape, string> = {
  circle: 'Circle',
  square: 'Square',
  triangle: 'Triangle',
  star: 'Star',
};

function ShapeIcon({ shape }: { shape: VisualMemoryShape }) {
  const base = 'mx-auto text-[#0F172A]';
  switch (shape) {
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className={`${base} w-10 h-10`} aria-hidden>
          <circle cx="12" cy="12" r="9" fill="currentColor" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className={`${base} w-10 h-10`} aria-hidden>
          <rect x="4" y="4" width="16" height="16" fill="currentColor" />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" className={`${base} w-10 h-10`} aria-hidden>
          <polygon points="12,3 21,21 3,21" fill="currentColor" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" className={`${base} w-10 h-10`} aria-hidden>
          <polygon
            points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
            fill="currentColor"
          />
        </svg>
      );
  }
}

interface VisualMemoryStepProps {
  displaySeconds: number;
  gridContents: { position: number; shape: VisualMemoryShape }[];
  askedPosition: number;
  options: VisualMemoryShape[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}

export function VisualMemoryStep({
  displaySeconds,
  gridContents,
  askedPosition,
  options,
  selectedIndex,
  onSelect,
  onContinue,
}: VisualMemoryStepProps) {
  const [phase, setPhase] = useState<'display' | 'recall'>('display');
  const [secondsLeft, setSecondsLeft] = useState(displaySeconds);

  const shapeByPosition = useMemo(() => {
    const map = new Map<number, VisualMemoryShape>();
    gridContents.forEach(({ position, shape }) => map.set(position, shape));
    return map;
  }, [gridContents]);

  useEffect(() => {
    if (phase !== 'display') return;

    setSecondsLeft(displaySeconds);
    const tick = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const done = setTimeout(() => setPhase('recall'), displaySeconds * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [displaySeconds, phase]);

  const cellLabel = POSITION_LABELS[askedPosition] ?? 'that cell';

  if (phase === 'display') {
    return (
      <QuestionShell
        fullWidth
        left={
          <div className="text-center space-y-8 py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A]">
              Memorize the position of each shape
            </h2>
            <div className="inline-grid grid-cols-3 gap-3 p-4 bg-[#F1F5F9] rounded-2xl">
              {Array.from({ length: 9 }, (_, i) => {
                const shape = shapeByPosition.get(i);
                return (
                  <div
                    key={i}
                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center"
                  >
                    {shape ? <ShapeIcon shape={shape} /> : null}
                  </div>
                );
              })}
            </div>
            <p className="text-slate-600">
              Disappears in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}
            </p>
          </div>
        }
      />
    );
  }

  return (
    <QuestionShell
      left={
        <>
          <p className="text-sm text-slate-600 uppercase tracking-wide">Visual memory</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] leading-snug">
            Which shape was in the {cellLabel} cell?
          </h2>
        </>
      }
      right={
        <>
          <p className="text-sm font-medium text-slate-600">Choose answer:</p>
          <div className="space-y-3">
            {options.map((shape, i) => (
              <MintOptionBar
                key={shape}
                label={SHAPE_LABELS[shape]}
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
