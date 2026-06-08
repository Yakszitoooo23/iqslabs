'use client';

import { useRef } from 'react';
import { resultsCopy } from '@/lib/copy';

function StarRating() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      {direction === 'left' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

export function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-review-card]')?.clientWidth ?? 280;
    el.scrollBy({
      left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16,
      behavior: 'smooth',
    });
  }

  return (
    <section className="mt-12 md:mt-16 -mx-6 md:mx-0">
      <div className="bg-sky-50 rounded-none md:rounded-2xl px-4 md:px-8 py-8 md:py-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous reviews"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-teal-700 hover:bg-teal-700/10 transition"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory flex-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {resultsCopy.reviews.map((review) => (
              <article
                key={review.name}
                data-review-card
                className="flex-shrink-0 snap-start w-[260px] sm:w-[280px] bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3"
              >
                <StarRating />
                <p className="font-bold text-slate-800 text-sm">{review.name}</p>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 flex-1">
                  {review.text}
                </p>
                <p className="text-xs text-slate-400">{review.timeAgo}</p>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next reviews"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-teal-700 hover:bg-teal-700/10 transition"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
