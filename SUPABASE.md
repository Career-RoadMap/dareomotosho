# Content library (Supabase)

`/resources` is a content library backed by Supabase, with a realtime
interaction layer. It runs in two modes:

- **No env vars** → served from local seed data (`lib/library.ts`), with a
  demo interaction layer. Everything builds and browses offline.
- **Configured** → reads/writes Supabase and streams live updates.

## Set up

1. Create a Supabase project.
2. Run `supabase/migrations/0001_library.sql` in the SQL editor. It creates:
   - **`entries`** — one table for all three models, discriminated by `type`
     (`course_qa`, `case_study`, `user_question`). Filter by `type`, `topic`,
     `level`, and `published`.
   - **`interactions`** — `comment` and `reaction` rows for the realtime layer.
   - Row-level security (public reads of published rows; public inserts for
     question submissions and interactions, gated by `approved` / `published`).
   - Realtime publication for both tables.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Add rows to `entries` and flip `published = true` to take them live.

## How it maps to the UI

- **Index** (`/resources`) — `LibraryBrowser` groups entries by type into the
  three sections and filters by topic/level. New published entries fold in
  live via a realtime subscription on `entries`.
- **Detail** (`/resources/[slug]`) — renders the Markdown `body` and mounts
  `EntryInteractions`: a live upvote count and comment thread subscribed to
  `interactions` for that entry. Comments post pending (`approved = false`);
  upvotes are auto-approved and appear immediately.
- **Ask a question** — `AskQuestion` inserts an unpublished `user_question`
  entry; once you publish it, it appears in the library live.

Moderation is just flipping `published` (entries) and `approved`
(interactions) — do it from the Supabase dashboard or your own admin.
