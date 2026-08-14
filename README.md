# Personal Brand Portfolio

**Builder · Mentor · Boardroom Translator** — a calm, premium, substantive
personal-brand site built with Next.js (App Router), TypeScript, and Tailwind CSS.

> A translator between the technical floor and the boardroom, who builds the
> systems that connect them.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static where possible)
npm run start    # serve the production build
```

## Design system

The brand is enforced through the theme, not page-by-page styling.

### Color — strict 5-token set (`tailwind.config.ts`)

| Token | Hex | Role |
| --- | --- | --- |
| Ink | `#0F1B2D` | Text / contrast only (and dark executive surfaces) |
| Signature Blue | `#1E3A5F` | The brand heart — primary buttons, key headings, deep surfaces |
| Blue-lift | `#3D6491` | Links, hover / active / focus only |
| Paper | `#F7F5F0` | Default background — never pure white |
| Amber | `#E0A951` | The single warm accent — used sparingly (≤1 per region) |

Reference colors **semantically** (`bg-background`, `text-foreground`,
`bg-signature`, `text-link`, `text-amber`). Section _temperature_ (cool /
balanced / warm) is dialed only by the amount of amber and light — the four
felt colors never change.

### Typography

- **Fraunces** (soft serif) — all headlines/display, loaded via `next/font`.
- **Inter** — body, UI, labels, buttons.
- Tight scale (`display / h1 / h2 / body / small`), generous line-height,
  restrained weights. Emphasis comes from size and space, not bold-everything.

### Motion (`app/globals.css`, `components/Reveal.tsx`)

- Slow, eased scroll reveals (fire once) are the default motion.
- Hero headline does a single slow rise on load.
- Page transitions dissolve via `app/template.tsx`.
- `prefers-reduced-motion` is honored everywhere.

## Structure

```
app/
  layout.tsx          Root layout: fonts, header (reads the Field Kit list), footer
  template.tsx        Page-transition dissolve
  globals.css         Tokens-in-CSS, reveal rules, .prose-entry, reduced-motion
  page.tsx            / (home)
  work/               /work — tiers as side-by-side tabs
  start-here/         /start-here
  ai-tutor/           /ai-tutor — the AWS exam coach (dharey.com)
  resources/          /resources, /resources/field-kit, /resources/[slug],
                      and the four collection pages
  path-finder/        /path-finder + /path-finder/[track] (+ OG image)
  speaking/  advisory/  about/  faq/  contact/  book/
  privacy/  terms/  cookies/
  api/                subscribe, contact, resources/*, download-image, report
components/           Header, Footer, Reveal, Button, forms, gates, cards
contents/
  resources/          One markdown file per episode kit (RESOURCES-CONTRACT.md)
lib/
  site.ts             Nav order, byline, social handles, booking URL
  resources.ts        Reads contents/resources/ — the file-based library
  resource-pdf.tsx    Markdown to PDF for the kit downloads
  report-pdf.tsx      The Path Finder result PDF
  subscribe.ts        The single client path onto the email list
  resource-gate.ts    Unlock cookie / storage keys
  rate-limit.ts       In-memory fixed-window limiter for the email routes
  email.ts            Sender sanitising + HTML escaping
  supabase.ts         Browser client (anon key only)
docs/                 Written documentation + the services spreadsheet
supabase/migrations/  Schema, RLS policies, indexes
```

## The email list, and the Field Kit gate

There is **one** list. The Subscribe form and the Field Kit unlock both go
through `lib/subscribe.ts`, which writes to the Resend audience (via
`/api/subscribe`) and to the Supabase `subscribers` table as a backup. Either
landing counts.

Neither store can hold a duplicate: `subscribers_email_unique` is on
`lower(email)`, and a Resend contact conflict is refused. `submitEmail()`
returns `alreadySubscribed` so the UI can say so, and so the gate can skip the
confirmation email for an address that has already had it. Addresses are
lowercased before either store sees them.

The gate itself is a **courtesy, not a security boundary**. The kits are free;
the `resources_unlocked` cookie only stops the site asking twice. Nothing
private sits behind it, so it is deliberately not built to resist someone
setting a cookie by hand. What *is* defended is the mail: `/api/resources/welcome`
is rate-limited per IP and capped at one send per address per day, so the route
cannot be used to mail a stranger repeatedly.

Both first-party cookies are `SameSite=Lax; Secure`. `app/cookies/page.tsx`
names them and the two matching local-storage keys; keep that page in step with
any change here, and with `app/privacy/page.tsx`.

## Short share links

A tracked URL is unreadable when it is shared, so `/go/<code>` carries the UTM
parameters instead of the shared string:

```
dareomotosho.com/go/w33
  → /resources/field-kit?utm_source=youtube&utm_medium=short
     &utm_campaign=cost-own-2026w33&utm_content=spark-the-wrong-question
```

147 characters becomes 31, and analytics still sees every parameter, because
they are attached on arrival rather than removed.

Add one by appending an entry to `shortLinks` in `lib/links.ts`; the defaults
(YouTube short → the Field Kit shelf) make most entries two lines. Codes match
case-insensitively, because they get retyped by hand out of video descriptions.

Two deliberate choices worth keeping:

- **They live on this domain, not a shortener.** bit.ly or lnkd.in would put a
  third party between the viewer and the site, can be blocked or rate-limited,
  dies with that company, and hands them the click.
- **`307`, and an unknown code never 404s.** The redirect is temporary so a
  destination can be repointed without a permanently cached 301 fighting it,
  and a mistyped code lands on the shelf, tagged `utm_campaign=unknown-code` so
  it is visible in analytics. Codes in a published video description are
  effectively permanent: add a new one, never repurpose an old one.

## Content sources

- **Episode kits** — markdown in `contents/resources/`. Dropping a file in is
  sufficient to publish it; see `RESOURCES-CONTRACT.md`, which is a contract, not
  a suggestion.
- **Library entries** (case studies, articles, Q&A) — Supabase, seeded by
  `scripts/seed.js` from `contents/`. See `SUPABASE.md`.
- **Everything else** — `lib/content.ts` and `lib/site.ts`.

## Environment

See `.env.example`. `RESEND_API_KEY` needs **full** access, not sending-only, or
audience writes fail — `GET /api/subscribe` is a diagnostic that says so in
plain words. The Supabase **service-role key is never set in Vercel**; it is used
only by the CI seed workflow. The browser gets the anon key and RLS.
