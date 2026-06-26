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
  layout.tsx          Root layout: fonts, header, footer, skip-link
  template.tsx        Page-transition dissolve
  globals.css         Tokens-in-CSS, reveal + reduced-motion rules
  page.tsx            / (home — balanced)
  work/               /work (executive)
  start-here/         /start-here (warm)
  resources/          /resources + /resources/[slug]
  live/               /live
  speaking/           /speaking (executive)
  advisory/           /advisory (executive)
  about/              /about (warmest)
  faq/                /faq
  contact/            /contact
components/           Header, Footer, Reveal, Button, forms, etc.
lib/
  site.ts             Nav order, byline, social handles
  content.ts          Sample content (the integration seam)
```

## Integration seams (intentionally not wired)

The UI is built; the data sources are left as clean seams:

- **Resource downloads** — `Resource.downloadUrl` in `lib/content.ts`
  (wire to R2 / object-store signed URLs).
- **Form submissions** — `EmailCapture` and `InquiryForm` validate and reflect
  state but do not POST; wire the marked `TODO(integration)` handlers to your
  provider (e.g. Supabase / email / CRM).
- **Social feeds** — the footer and home "latest" strip reserve space for a
  live YouTube fetch and cached X / LinkedIn embeds.
- **FAQ** — `faqs` is a seed; back it with a CMS/Supabase to edit without redeploy.

All content lives in `lib/content.ts` — swap the source, keep the components.
