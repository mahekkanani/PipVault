-- Reference only. Run this manually in the Supabase SQL editor for a new PipVault project.

create table trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  pair text, side text, lot_size numeric, entry numeric,
  take_profit numeric, stop_loss numeric, exit numeric,
  captured_pips numeric, profit_loss numeric, rr_ratio numeric,
  date date, session text, emotion text, notes text,
  screenshot text, created_at timestamp default now()
);

create table backtests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  strategy text, pair text, side text, entry numeric,
  take_profit numeric, stop_loss numeric, exit numeric,
  captured_pips numeric, profit_loss numeric, rr_ratio numeric,
  date date, session text, setup_grade text,
  followed_rules boolean, mistake text, notes text,
  screenshot text, created_at timestamp default now()
);

alter table trades enable row level security;
alter table backtests enable row level security;

create policy "Users see own trades"
  on trades for all using (auth.uid() = user_id);

create policy "Users see own backtests"
  on backtests for all using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do update set public = excluded.public;
