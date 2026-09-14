-- Daybook schema.
--
-- One generic table instead of one table per feature: it mirrors the app's
-- existing collection model exactly (time_entries, food_entries,
-- nutrition_targets, reflections, books, reading_vault, learning_topics —
-- and any future one) needs zero schema changes when a new module is added.
--
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- on a fresh project.

create table if not exists public.records (
  user_id uuid not null references auth.users (id) on delete cascade,
  collection text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, collection, id)
);

create index if not exists records_user_collection_idx on public.records (user_id, collection);

alter table public.records enable row level security;

-- Each signed-in user can only ever read or write their own rows.
create policy "Users manage their own records" on public.records
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
