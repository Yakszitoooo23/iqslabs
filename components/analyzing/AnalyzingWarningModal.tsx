'use client';

import { analyzingCopy } from '@/lib/copy';

interface AnalyzingWarningModalProps {
  open: boolean;
  onClose: () => void;
}

function LockIcon() {
  return (
    <svg
      className="w-5 h-5 text-accent shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

export function AnalyzingWarningModal({ open, onClose }: AnalyzingWarningModalProps) {
  if (!open) return null;

  const { warning } = analyzingCopy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analyzing-warning-title"
    >
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" aria-hidden />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl px-8 py-10 text-center">
        <h2
          id="analyzing-warning-title"
          className="text-2xl md:text-3xl font-bold text-accent uppercase tracking-wide mb-6"
        >
          {warning.title}
        </h2>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
          {warning.body}
        </p>

        <div className="flex items-center justify-center gap-3 bg-slate-100 rounded-xl px-5 py-4 mb-8 text-left sm:text-center">
          <LockIcon />
          <p className="text-sm md:text-base text-slate-700 leading-snug">{warning.privacy}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base uppercase tracking-wide transition"
        >
          {warning.button}
        </button>
      </div>
    </div>
  );
}
