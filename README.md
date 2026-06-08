# IQ Test MVP

Minimal Next.js scaffold for an IQ test funnel: quiz → paywall → report → dashboard with games.

## Stack
- Next.js 14 (App Router)
- Stripe (checkout + customer portal)
- Supabase (auth + database)
- Tailwind for styling

## Pages
- `/`, landing page, CTA to start quiz
- `/quiz`, 25-question quiz with timer
- `/results`, score teaser + Stripe paywall
- `/dashboard`, full report + games (paid users only)
- `/games`, brain training games

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in keys
3. Create Supabase tables (see `supabase/schema.sql`)
4. Create Stripe product: $0.99 trial → $24.99/month
5. `npm run dev`

## Build order (what's done)
- [x] Quiz engine (data-driven, ready for multiple tests later)
- [x] Scoring algorithm
- [x] Results page with paywall
- [x] Stripe Checkout integration
- [x] Stripe webhook → Supabase user creation
- [x] Dashboard with locked/unlocked report
- [x] Two games (reaction time, n-back)

## What to add later
- More games
- Email sequences (Resend)
- Daily training content
- More test products (architecture supports this, see `data/tests/`)
