-- 0006 — Email subscribers. Safe to run repeatedly.
--
-- The site's email-capture forms write here. Anon visitors may INSERT a
-- syntactically valid email and nothing else; nobody can read the list with
-- the public key (no SELECT policy), so the list is only visible from the
-- Supabase dashboard / service role.

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  -- Which page the signup came from (e.g. "/", "/path-finder", "/resources").
  source      text,
  created_at  timestamptz not null default now()
);

-- One row per address, case-insensitive.
create unique index if not exists subscribers_email_unique
  on public.subscribers (lower(email));

alter table public.subscribers enable row level security;

drop policy if exists "subscribe" on public.subscribers;
create policy "subscribe" on public.subscribers
  for insert with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(email) <= 320
    and char_length(coalesce(source, '')) <= 120
  );
