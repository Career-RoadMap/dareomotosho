-- Consolidated schema for the site's Supabase backend. Idempotent and safe to
-- run (or re-run) in the Supabase SQL editor; it replaces the earlier
-- incremental migrations 0001–0007. A fresh project needs only this file.
--
-- Covers: the content library (entries), the realtime discussion layer
-- (interactions), the email list (subscribers), all indexes, the
-- row-level-security policies, and the realtime publication.

-- ── entries ────────────────────────────────────────────────────────────
-- One table powers the four content models, discriminated by `type`.
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  slug        text,
  type        text,
  title       text,
  body        text not null default '',        -- long-form Markdown
  summary     text not null default '',        -- teaser for cards/lists
  topic       text not null default 'cloud',   -- e.g. cloud, cybersecurity, ai-era
  level       text not null default 'practitioner',
  asker       text,                            -- attribution for user_question; null otherwise
  source_note text,                            -- internal provenance note (not rendered)
  published   boolean not null default false,  -- draft until you flip it live
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Add any columns a pre-existing table might be missing (older provisioning).
alter table public.entries add column if not exists slug        text;
alter table public.entries add column if not exists type        text;
alter table public.entries add column if not exists title       text;
alter table public.entries add column if not exists body        text not null default '';
alter table public.entries add column if not exists summary     text not null default '';
alter table public.entries add column if not exists topic       text not null default 'cloud';
alter table public.entries add column if not exists level       text not null default 'practitioner';
alter table public.entries add column if not exists asker       text;
alter table public.entries add column if not exists source_note text;
alter table public.entries add column if not exists published   boolean not null default false;
alter table public.entries add column if not exists created_at  timestamptz not null default now();
alter table public.entries add column if not exists updated_at  timestamptz not null default now();

-- Backfill + de-duplicate slugs so NOT NULL + UNIQUE can hold on old rows.
update public.entries
set slug = trim(both '-' from
  regexp_replace(lower(coalesce(nullif(title, ''), 'entry')), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

update public.entries e
set slug = e.slug || '-' || left(e.id::text, 8)
where exists (
  select 1 from public.entries d
  where d.slug = e.slug and d.id <> e.id and d.created_at < e.created_at
);

alter table public.entries alter column slug set not null;

-- Type + level check constraints (drop-then-add makes them idempotent).
alter table public.entries drop constraint if exists entries_type_check;
alter table public.entries add constraint entries_type_check
  check (type in ('course_qa','case_study','user_question','article'));

alter table public.entries drop constraint if exists entries_level_check;
alter table public.entries add constraint entries_level_check
  check (level in ('newcomer','practitioner','executive'));

create unique index if not exists entries_slug_key   on public.entries (slug);
create index if not exists entries_type_idx           on public.entries (type);
create index if not exists entries_topic_idx          on public.entries (topic);
create index if not exists entries_level_idx          on public.entries (level);
create index if not exists entries_published_idx      on public.entries (published);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists entries_touch_updated_at on public.entries;
create trigger entries_touch_updated_at
  before update on public.entries
  for each row execute function public.touch_updated_at();

-- ── interactions (comments + reactions) ────────────────────────────────
create table if not exists public.interactions (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references public.entries (id) on delete cascade,
  kind        text not null check (kind in ('comment','reaction')),
  body        text,                            -- comment text (null for reactions)
  author      text,                            -- visitor name/handle
  approved    boolean not null default false,  -- moderation gate
  created_at  timestamptz not null default now()
);

create index if not exists interactions_entry_idx on public.interactions (entry_id);

-- ── subscribers (email list) ───────────────────────────────────────────
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text,                            -- which page the signup came from
  created_at  timestamptz not null default now()
);

create unique index if not exists subscribers_email_unique
  on public.subscribers (lower(email));

-- ── Row-level security ─────────────────────────────────────────────────
alter table public.entries      enable row level security;
alter table public.interactions enable row level security;
alter table public.subscribers  enable row level security;

-- Entries: anyone may read published rows.
drop policy if exists "read published entries" on public.entries;
create policy "read published entries" on public.entries
  for select using (published = true);

-- Entries: anyone may submit a question (unpublished, size-bounded).
drop policy if exists "submit questions" on public.entries;
create policy "submit questions" on public.entries
  for insert with check (
    type = 'user_question'
    and published = false
    and char_length(title) between 1 and 300
    and char_length(coalesce(summary, '')) <= 300
    and char_length(coalesce(body, '')) <= 4000
    and char_length(coalesce(asker, '')) <= 160
    and char_length(slug) <= 80
  );

-- Interactions: anyone may read approved rows.
drop policy if exists "read approved interactions" on public.interactions;
create policy "read approved interactions" on public.interactions
  for select using (approved = true);

-- Interactions: anyone may add a pending comment or an auto-approved reaction,
-- both size-bounded.
drop policy if exists "add interactions" on public.interactions;
create policy "add interactions" on public.interactions
  for insert with check (
    (
      kind = 'comment'
      and approved = false
      and char_length(coalesce(body, '')) between 1 and 4000
      and char_length(coalesce(author, '')) <= 160
    )
    or (
      kind = 'reaction'
      and approved = true
      and body is null
    )
  );

-- Subscribers: anyone may add one valid email (no read policy, so the list is
-- visible only from the dashboard / service role).
drop policy if exists "subscribe" on public.subscribers;
create policy "subscribe" on public.subscribers
  for insert with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(email) <= 320
    and char_length(coalesce(source, '')) <= 120
  );

-- ── Realtime ───────────────────────────────────────────────────────────
-- Publish entries + interactions for live subscriptions, guarded so re-runs
-- don't error on an already-published table.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'entries'
    ) then
      alter publication supabase_realtime add table public.entries;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'interactions'
    ) then
      alter publication supabase_realtime add table public.interactions;
    end if;
  end if;
end $$;
