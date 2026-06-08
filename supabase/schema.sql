-- Run this in Supabase SQL editor

-- Users table linked to Supabase auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  referral_code text unique,
  stripe_customer_id text unique,
  subscription_status text default 'inactive', -- 'trialing', 'active', 'canceled', 'past_due', 'inactive'
  cancel_at_period_end boolean default false,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Pre-checkout score storage (token passed through Stripe metadata)
create table public.pending_results (
  token uuid default gen_random_uuid() primary key,
  email text,
  test_type text not null,
  score_data jsonb not null,
  ai_interpretation text,
  created_at timestamptz default now()
);

-- Enable RLS on pending_results
alter table public.pending_results enable row level security;

-- No policies = no access from anon or authenticated clients
-- Only the service role key (server-side) can read/write this table.
-- This is intentional: pending_results contains pre-checkout quiz data
-- that should never be accessible to clients via the public anon key.

-- Quiz results, designed to support multiple test types later
create table public.test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  test_type text not null, -- 'iq', 'attachment', 'astrology', etc. (portfolio-ready)
  raw_score integer not null,
  scaled_score integer not null, -- IQ on the 100-mean scale
  percentile numeric(5,2),
  answers jsonb not null,
  time_taken_seconds integer,
  ai_interpretation text,
  completed_at timestamptz default now()
);

-- Index for fast user lookups
create index profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index test_results_user_id_idx on public.test_results(user_id);
create index pending_results_token_idx on public.pending_results(token);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.test_results enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can read own test results"
  on public.test_results for select
  using (auth.uid() = user_id);

-- Migration for existing databases (run if tables already exist):
-- create table public.pending_results (...);
-- alter table public.test_results add column if not exists ai_interpretation text;
-- alter table public.profiles add column if not exists full_name text;
-- alter table public.profiles add column if not exists referral_code text unique;
-- alter table public.profiles add column if not exists cancel_at_period_end boolean default false;
-- create unique index if not exists profiles_referral_code_idx on public.profiles(referral_code);
-- alter table public.pending_results enable row level security;
