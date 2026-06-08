'use client';

import { ReactNode } from 'react';
import type { HypeIllustration } from '@/lib/hypeMessages';

export interface InterstitialProps {
  headline: string;
  subtitle: string;
  illustration: HypeIllustration;
  format?: string;
  buttonText?: string;
  onContinue: () => void;
}

function ClimbingIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      <rect x="20" y="170" width="160" height="6" rx="3" fill="#E2E8F0" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={35 + i * 32}
          y={145 - i * 28}
          width="28"
          height="8"
          rx="2"
          fill="#CBD5E1"
        />
      ))}
      <circle cx="52" cy="95" r="8" fill="#1E3A8A" />
      <rect x="46" y="103" width="12" height="18" rx="3" fill="#2563EB" />
      <line x1="46" y1="110" x2="34" y2="122" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="110" x2="62" y2="125" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="28" x2="155" y2="48" stroke="#2563EB" strokeWidth="2" />
      <polygon points="155,18 165,32 145,32" fill="#2563EB" />
    </svg>
  );
}

function LightbulbIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="100"
          x2={100 + 55 * Math.cos((deg * Math.PI) / 180)}
          y2={100 + 55 * Math.sin((deg * Math.PI) / 180)}
          stroke="#BFDBFE"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M100 45 C75 45 62 65 62 85 C62 100 72 112 78 118 L78 135 L122 135 L122 118 C128 112 138 100 138 85 C138 65 125 45 100 45Z"
        fill="#F8FAFC"
        stroke="#1E3A8A"
        strokeWidth="2"
      />
      <rect x="78" y="138" width="44" height="12" rx="4" fill="#2563EB" />
      <rect x="84" y="152" width="32" height="8" rx="3" fill="#93C5FD" />
    </svg>
  );
}

function BrainIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      <path
        d="M100 40 C70 40 50 65 50 95 C50 115 58 128 65 138 C55 148 52 162 58 172 C68 182 82 175 88 165 C92 168 96 170 100 170 C104 170 108 168 112 165 C118 175 132 182 142 172 C148 162 145 148 135 138 C142 128 150 115 150 95 C150 65 130 40 100 40Z"
        fill="#F8FAFC"
        stroke="#1E3A8A"
        strokeWidth="2"
      />
      <path
        d="M100 55 C100 55 85 70 85 95 C85 110 92 120 100 125 C108 120 115 110 115 95 C115 70 100 55 100 55Z"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line x1="100" y1="55" x2="100" y2="155" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

function RocketIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      <ellipse cx="100" cy="165" rx="20" ry="8" fill="#BFDBFE" opacity="0.5" />
      <path d="M100 35 L118 95 L100 85 L82 95 Z" fill="#2563EB" />
      <rect x="88" y="85" width="24" height="55" rx="8" fill="#1E3A8A" />
      <path d="M82 115 L68 135 L82 125 Z" fill="#93C5FD" />
      <path d="M118 115 L132 135 L118 125 Z" fill="#93C5FD" />
      <circle cx="100" cy="105" r="6" fill="#BFDBFE" />
      <path d="M92 140 Q100 165 108 140" fill="#F59E0B" opacity="0.8" />
      <path d="M96 145 Q100 175 104 145" fill="#EF4444" opacity="0.7" />
    </svg>
  );
}

function MedalIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      <path d="M75 55 L100 85 L125 55 L115 110 L85 110 Z" fill="#2563EB" opacity="0.85" />
      <path d="M125 55 L135 95 L115 110 Z" fill="#1E3A8A" />
      <path d="M75 55 L65 95 L85 110 Z" fill="#1E3A8A" />
      <circle cx="100" cy="130" r="38" fill="#F8FAFC" stroke="#1E3A8A" strokeWidth="3" />
      <circle cx="100" cy="130" r="28" fill="none" stroke="#2563EB" strokeWidth="2" />
      <text x="100" y="138" textAnchor="middle" fill="#2563EB" fontSize="22" fontWeight="700">
        ★
      </text>
    </svg>
  );
}

function SparklesIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" aria-hidden>
      {[
        { cx: 100, cy: 80, r: 18 },
        { cx: 55, cy: 120, r: 12 },
        { cx: 145, cy: 115, r: 14 },
        { cx: 80, cy: 55, r: 8 },
        { cx: 130, cy: 50, r: 10 },
      ].map(({ cx, cy, r }, i) => (
        <g key={i}>
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#2563EB" strokeWidth="2" />
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#2563EB" strokeWidth="2" />
          <line
            x1={cx - r * 0.7}
            y1={cy - r * 0.7}
            x2={cx + r * 0.7}
            y2={cy + r * 0.7}
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          <line
            x1={cx + r * 0.7}
            y1={cy - r * 0.7}
            x2={cx - r * 0.7}
            y2={cy + r * 0.7}
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS: Record<HypeIllustration, () => JSX.Element> = {
  climbing: ClimbingIllustration,
  lightbulb: LightbulbIllustration,
  brain: BrainIllustration,
  rocket: RocketIllustration,
  medal: MedalIllustration,
  sparkles: SparklesIllustration,
};

/** Wrap percentages, "top X%", and streak numbers in blue accent. */
export function highlightHeadline(text: string): ReactNode {
  const parts = text.split(/(\d+%|\d+\s+correct\s+in\s+a\s+row|top\s+\d+%[^!]*)/gi);
  return parts.map((part, i) => {
    if (/^\d+%|\d+\s+correct|top\s+\d+/i.test(part)) {
      return (
        <span key={i} className="text-blue-600">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function Interstitial({
  headline,
  subtitle,
  illustration,
  buttonText = 'Continue',
  onContinue,
}: InterstitialProps) {
  const Illustration = ILLUSTRATIONS[illustration];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <div className="w-full max-w-2xl text-center space-y-8 px-4">
        <Illustration />
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">
            {highlightHeadline(headline)}
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition shadow-sm"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
