-- 0003 — Ensure public read access to published entries (and approved
-- interactions). Safe to run repeatedly.
--
-- Why this exists: /resources reads `entries` with the public anon key. With
-- RLS ENABLED but no matching SELECT policy, those reads return zero rows
-- *silently* (no error) — so the page renders nothing and does not even fall
-- back to seed data. A table created before 0001_library.sql can have RLS on
-- (its inserts were already being blocked) yet never have received the read
-- policy. This restores it.

-- Entries: anyone may read published rows.
alter table public.entries enable row level security;

drop policy if exists "read published entries" on public.entries;
create policy "read published entries" on public.entries
  for select using (published = true);

-- Interactions: anyone may read approved rows (powers the comment/upvote feed).
alter table public.interactions enable row level security;

drop policy if exists "read approved interactions" on public.interactions;
create policy "read approved interactions" on public.interactions
  for select using (approved = true);
