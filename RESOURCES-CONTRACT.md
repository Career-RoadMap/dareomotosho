# The Resources Contract

This file is the interface between this website and the content system that
produces episodes ("Forge"). The two systems share this file format and
nothing else. Forge writes files; the website renders them. Neither side
needs to know anything else about the other.

## Where resource files live

```
contents/resources/
```

One markdown file per episode. The filename should match the slug
(`<slug>.md`), but the `slug` frontmatter field is canonical.

> **Reserved slug: `field-kit`.** The shelf that lists every kit lives at
> `/resources/field-kit`, and a static route takes precedence over the
> dynamic `[slug]` one, so a kit using that exact slug would be shadowed by
> the shelf and its own page would be unreachable. Any other slug is fine.

> **`https://dareomotosho.com/resources/field-kit` is a permanent URL.**
> It is printed in every video description, so it is load-bearing off-site
> and cannot be treated as an internal path. Do not rename, nest, or
> restructure that route. If it ever has to move, the move is only complete
> once a permanent redirect from `/resources/field-kit` to the new location
> ships in the same change (`redirects()` in `next.config.mjs`).

> Note: the Supabase seeder (`scripts/seed.js`) only ingests `contents/`
> subfolders whose names match case studies / articles / Q&A / user
> questions. `contents/resources/` is deliberately outside that set — these
> files are rendered directly from disk and never touch Supabase.

## The file format

Each file starts with this exact frontmatter, followed by a markdown body:

```markdown
---
title: The Unchosen Log
slug: lock-in-is-unrecorded
episode: Lock-in is a record-keeping failure
takeaway: "Write down what you did not choose."
domain: cloud-platform
audience: decision-maker
date: 2026-08-11
---
(markdown body)
```

Field by field:

| Field | Meaning | Rules |
|---|---|---|
| `title` | The resource's name, shown as the page heading and card title | Required |
| `slug` | URL path segment: the page lives at `/resources/<slug>` | Required. Lowercase, hyphenated, unique across the folder |
| `episode` | The episode this resource ships with | Required. Shown on the card and page |
| `takeaway` | The one-line practice, quoted | Required. Shown on the card and above the fold |
| `domain` | Content pillar, e.g. `cloud-platform`, `security`, `business-systems` | Required. Hyphenated token; the site turns it into a display label |
| `audience` | `decision-maker` or `practitioner` | Required |
| `date` | Publication date, `YYYY-MM-DD` | Required. Drives newest-first ordering in the library |

Values may be wrapped in single or double quotes or left bare; the site
strips one layer of quotes. Every field is a single line.

The body is plain markdown (GitHub-flavoured tables supported). Convention
used by the site:

- The body may open with an `# H1` equal to the title; the site strips it
  (the title is already rendered from frontmatter) — so the file also reads
  standalone.
- A `## When to use it` section, if present, is used as the public preview
  of the gated page. If absent, the first `##` section is previewed.

## The guarantee this contract protects

**Adding a file to `contents/resources/` MUST be sufficient to make the
page exist after deploy. No code edits. No registration step. No list to
append to.**

Concretely, when a file lands in the folder:

- `/resources/<slug>` renders the resource page,
- `/resources/field-kit` lists its card (newest first),
- the Resources nav dropdown lists it under "The Field Kit" (newest first),
- the sitemap includes its URL,
- the kit is downloadable as a PDF once the reader has unlocked.

Ordering everywhere is `date` descending, with `title` as a stable tie-break
so kits sharing a date keep a deterministic order (`getResources()` in
`lib/resources.ts` is the single sort; nothing re-sorts downstream).

The nav submenu is capped at the newest five kits (`KITS_IN_MENU` in
`components/Header.tsx`) — the latest episode's kit is therefore always the
first row, while a forty-kit back catalogue never turns the dropdown into a
scrollable wall. "The Field Kit" above them remains the see-everything link.
The cap is a constant, not a list: the zero-edit property is unaffected.

All of these read the folder directly at build/render time. If a future change
to this site would require touching any code to make a new resource file
appear, that change breaks this contract — do not make it. Forge will write
files matching this contract forever, unattended.

## What the site does with a resource

- The page at `/resources/<slug>` shows the title, episode, takeaway, and
  the preview section publicly (crawlable, with title/description metadata
  from frontmatter).
- The full body is revealed after the reader leaves an email **once** —
  the unlock is stored in the browser (localStorage + cookie), and every
  later resource opens in one click. Emails go to the same Resend audience
  the site's Subscribe form uses; there is no separate list.
- Once unlocked, the kit is also downloadable as a **PDF**, rendered from
  the same markdown (`lib/resource-pdf.tsx`) so the fill-in tables survive
  as tables with room to write. The download is behind the same cookie as
  the body.
- The first unlock also sends a **confirmation email** naming the kit and
  linking back to it and to the shelf. It is sent best-effort and never
  blocks the unlock: if the mail fails, the reader still gets their kit.
