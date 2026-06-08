'use client';

import { BRAND, resultsCopy } from '@/lib/copy';
import { formatTestsTaken, getDailyTestsTaken } from '@/lib/dailyStats';

function GraduationIcon() {
  return (
    <svg className="w-6 h-6 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3L2 8l10 5 10-5-10-5zM4 10v5c0 2.5 3.5 4.5 8 4.5s8-2 8-4.5v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 8l-10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-6 h-6 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 15V11M12 15V7M16 15v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const TRUST_ICONS = [GraduationIcon, DocumentIcon, ChartIcon];

export function SocialProofColumn() {
  const testsToday = getDailyTestsTaken();

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
        <p className="text-[#0F172A] font-semibold text-lg">
          Over {formatTestsTaken(testsToday)} tests taken today
        </p>
        <p className="text-slate-600">
          Average IQ score:{' '}
          <span className="font-semibold text-[#0F172A]">{resultsCopy.averageIq}</span>
        </p>
      </div>

      <div className="space-y-5">
        <h2 className="text-lg font-bold text-[#0F172A]">{resultsCopy.trustTitle(BRAND)}</h2>
        <ul className="space-y-5">
          {resultsCopy.trustItems.map((item, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li key={item.title} className="flex gap-4">
                <Icon />
                <div>
                  <p className="font-semibold text-[#0F172A]">{item.title}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {resultsCopy.featuredTitle(BRAND)}
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
          {resultsCopy.mediaLogos.map((logo) => (
            <span
              key={logo.name}
              className={`text-slate-400 text-xs md:text-sm ${logo.className}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
