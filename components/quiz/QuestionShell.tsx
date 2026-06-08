import { ReactNode } from 'react';

interface QuestionShellProps {
  left: ReactNode;
  right?: ReactNode;
  fullWidth?: boolean;
}

/** Split layout: question left, options right. No progress bar. */
export function QuestionShell({ left, right, fullWidth }: QuestionShellProps) {
  if (fullWidth || !right) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
        {left}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div className="space-y-6">{left}</div>
        <div className="space-y-4">{right}</div>
      </div>
    </div>
  );
}

export function MintOptionBar({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl transition ${
        selected
          ? 'bg-emerald-50 ring-2 ring-emerald-400 ring-offset-1'
          : 'bg-emerald-50 hover:bg-emerald-100/80'
      }`}
    >
      <span className="text-[#0F172A] font-medium">{label}</span>
    </button>
  );
}

const LIKERT_COLORS = [
  'bg-emerald-100 hover:bg-emerald-200/90',
  'bg-emerald-50 hover:bg-emerald-100',
  'bg-amber-50 hover:bg-amber-100',
  'bg-rose-50 hover:bg-rose-100',
  'bg-rose-100 hover:bg-rose-200/90',
];

export function LikertOptionBar({
  label,
  index,
  selected,
  onClick,
}: {
  label: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl transition ${LIKERT_COLORS[index]} ${
        selected ? 'ring-2 ring-accent ring-offset-1' : ''
      }`}
    >
      <span className="text-[#0F172A] font-medium">{label}</span>
    </button>
  );
}

export function ContinueButton({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full md:w-auto px-10 py-4 bg-accent hover:bg-blue-700 text-white font-semibold rounded-xl transition text-lg"
    >
      {label}
    </button>
  );
}
