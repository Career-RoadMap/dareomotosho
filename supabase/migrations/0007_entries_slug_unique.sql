-- 0007 — Ensure entries.slug has a UNIQUE index. Safe to run repeatedly.
--
-- Why this exists: the seeder's --update mode upserts with
-- `on_conflict=slug`, which PostgREST can only resolve when a UNIQUE
-- constraint or unique index actually exists on entries.slug. Migrations
-- 0001/0002 declare it, but a table provisioned before those ran (migrations
-- here are applied by hand in the SQL editor) can be missing it, producing:
--   "there is no unique or exclusion constraint matching the ON CONFLICT
--    specification"
-- This migration de-duplicates any colliding slugs first, then creates the
-- index, so it succeeds even on a table that already has duplicates.

-- 1. Backfill any null/blank slugs so the unique index can hold.
update public.entries
set slug = 'entry-' || left(id::text, 8)
where slug is null or slug = '';

-- 2. De-duplicate colliding slugs, keeping the oldest row's slug untouched
--    and suffixing the rest with a short slice of their id.
update public.entries e
set slug = e.slug || '-' || left(e.id::text, 8)
where exists (
  select 1 from public.entries d
  where d.slug = e.slug
    and d.id <> e.id
    and d.created_at < e.created_at
);

-- 3. Create the unique index the upsert needs (no-op if it already exists).
create unique index if not exists entries_slug_key on public.entries (slug);
