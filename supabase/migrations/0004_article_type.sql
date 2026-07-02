-- 0004 — Support a fourth entry type: "article" (long-form, rewritten pieces
-- repurposed from other channels), plus an internal source_note column.
--
-- Idempotent: safe to run repeatedly.

-- Widen the type check constraint to include 'article'.
alter table public.entries drop constraint if exists entries_type_check;
alter table public.entries add constraint entries_type_check
  check (type in ('course_qa','case_study','user_question','article'));

-- Internal provenance note (e.g. "Originally published on LinkedIn;
-- substantially rewritten for site"). Not selected/rendered by the site UI,
-- kept purely for editorial reference.
alter table public.entries add column if not exists source_note text;
