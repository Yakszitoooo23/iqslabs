'use client';

import { PatternCellData } from '@/data/patternTypes';
import { PatternMatrixGrid, PatternOptionGrid } from '@/components/patterns/PatternCell';
import { QuestionShell } from './QuestionShell';

interface PatternMatrixStepProps {
  grid: (PatternCellData | null)[][];
  options: PatternCellData[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}

export function PatternMatrixStep({
  grid,
  options,
  selectedIndex,
  onSelect,
  onContinue,
}: PatternMatrixStepProps) {
  return (
    <QuestionShell
      left={
        <>
          <p className="text-sm text-slate-600 uppercase tracking-wide">Pattern recognition</p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#0F172A]">
            Which figure completes the pattern?
          </h2>
          <div className="flex justify-center lg:justify-start pt-2">
            <PatternMatrixGrid grid={grid} cellSize={grid.length === 2 ? 80 : 64} />
          </div>
        </>
      }
      right={
        <>
          <p className="text-sm font-medium text-slate-600">Choose answer:</p>
          <PatternOptionGrid
            options={options}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            cellSize={52}
          />
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
