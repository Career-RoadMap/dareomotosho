-- Content library schema for /resources.
-- Run in the Supabase SQL editor (or via the CLI) to provision the backend.

-- ── entries ────────────────────────────────────────────────────────────
-- One table powers the three content models, discriminated by `type`.
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  type        text not null check (type in ('course_qa','case_study','user_question')),
  title       text not null,
  body        text not null default '',        -- long-form Markdown
  summary     text not null default '',        -- teaser for cards/lists
  topic       text not null default 'cloud',   -- e.g. cloud, cybersecurity, ai-era
  level       text not null default 'practitioner' check (level in ('newcomer','practitioner','executive')),
  asker       text,                            -- attribution for user_question; null otherwise
  published   boolean not null default false,  -- draft until you flip it live
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists entries_type_idx      on public.entries (type);
create index if not exists entries_topic_idx     on public.entries (topic);
create index if not exists entries_level_idx     on public.entries (level);
create index if not exists entries_published_idx on public.entries (published);

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

-- ── interactions (Phase 2: comments + reactions) ───────────────────────
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

-- ── Row-level security ─────────────────────────────────────────────────
alter table public.entries      enable row level security;
alter table public.interactions enable row level security;

-- Anyone may read published entries.
drop policy if exists "read published entries" on public.entries;
create policy "read published entries" on public.entries
  for select using (published = true);

-- Anyone may submit a question, but only as an unpublished user_question.
drop policy if exists "submit questions" on public.entries;
create policy "submit questions" on public.entries
  for insert with check (type = 'user_question' and published = false);

-- Anyone may read approved interactions.
drop policy if exists "read approved interactions" on public.interactions;
create policy "read approved interactions" on public.interactions
  for select using (approved = true);

-- Anyone may add a comment (pending) or a reaction (auto-approved).
drop policy if exists "add interactions" on public.interactions;
create policy "add interactions" on public.interactions
  for insert with check (
    (kind = 'comment'  and approved = false) or
    (kind = 'reaction' and approved = true)
  );

-- ── Realtime ───────────────────────────────────────────────────────────
-- Publish both tables so the client can subscribe to live changes.
alter publication supabase_realtime add table public.entries;
alter publication supabase_realtime add table public.interactions;
