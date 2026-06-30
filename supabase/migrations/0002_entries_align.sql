-- 0002 — Align an existing public.entries table with 0001_library.sql.
--
-- 0001_library.sql creates the table with `create table if not exists`, so a
-- database that ALREADY had an `entries` table (provisioned before that
-- migration, or created out-of-band) never received the newer columns. The
-- seeder then fails with:
--     ✗ Could not read existing slugs: column entries.slug does not exist
--
-- This migration adds any missing columns + the slug constraint. It is
-- idempotent and safe to run repeatedly. Run it once in the Supabase SQL
-- editor (the CI seeder uses the anon key and cannot alter schema).

-- 1. Add every column the seeder reads/writes, if it isn't already present.
--    Columns with a NOT NULL default are safe to add to a table with rows.
alter table public.entries add column if not exists slug       text;
alter table public.entries add column if not exists type       text;
alter table public.entries add column if not exists title      text;
alter table public.entries add column if not exists body       text not null default '';
alter table public.entries add column if not exists summary    text not null default '';
alter table public.entries add column if not exists topic      text not null default 'cloud';
alter table public.entries add column if not exists level      text not null default 'practitioner';
alter table public.entries add column if not exists asker      text;
alter table public.entries add column if not exists published  boolean not null default false;
alter table public.entries add column if not exists created_at timestamptz not null default now();
alter table public.entries add column if not exists updated_at timestamptz not null default now();

-- 2. Backfill slug for any pre-existing rows so NOT NULL + UNIQUE can hold.
update public.entries
set slug = trim(
  both '-' from
  regexp_replace(lower(coalesce(nullif(title, ''), 'entry')), '[^a-z0-9]+', '-', 'g')
)
where slug is null or slug = '';

-- De-duplicate any colliding backfilled slugs by suffixing the row id.
update public.entries e
set slug = e.slug || '-' || left(e.id::text, 8)
where exists (
  select 1 from public.entries d
  where d.slug = e.slug and d.id <> e.id
);

-- 3. Enforce the constraints declared in 0001 for the slug column.
alter table public.entries alter column slug set not null;
create unique index if not exists entries_slug_key on public.entries (slug);
