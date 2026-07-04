-- 0005 — Cap the size of anonymous inserts. Safe to run repeatedly.
--
-- The anon key may insert unpublished user questions and pending comments
-- (the moderation gates from 0001). Those policies had no size limits, so
-- anyone with the public key could write unbounded payloads. These caps are
-- generous for real use and only bound anon/PostgREST writes; the seeder
-- uses the service role, which bypasses RLS, so long article bodies are
-- unaffected.

-- Entries: question submissions, bounded.
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

-- Interactions: comments bounded; reactions carry no body at all.
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
