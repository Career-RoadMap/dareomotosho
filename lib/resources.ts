import fs from "fs";
import path from "path";
import { cache } from "react";

/**
 * Episode resources — the file-based half of the library.
 *
 * One markdown file per episode lives in `contents/resources/`; the format
 * is defined in RESOURCES-CONTRACT.md at the repo root. The whole design
 * rests on one property: dropping a file into that folder is SUFFICIENT to
 * make its page exist after deploy — no registration step, no code edit.
 * Everything here reads the folder directly; never add a hand-maintained
 * list in front of it.
 *
 * These files never touch Supabase (the seeder ignores the folder); they
 * are rendered straight from disk, so this module must stay server-only.
 */

export type Resource = {
  slug: string;
  title: string;
  /** The episode this resource ships with. */
  episode: string;
  /** The one-line practice, e.g. "Cost the options. Do not rank them." */
  takeaway: string;
  /** Content pillar token, e.g. cloud-platform, security, business-systems. */
  domain: string;
  audience: string;
  /** Publication date, YYYY-MM-DD; drives newest-first ordering. */
  date: string;
  /** Full markdown body, leading H1 (== title) stripped. */
  body: string;
  /**
   * The public, ungated opening of the body: the intro plus the "When to
   * use it" section when it comes first (per the contract's convention).
   * Rendered server-side, crawlable.
   */
  preview: string;
  /**
   * Everything after the preview — the part that unlocks with an email.
   * Served only by the cookie-checked content API, never in the page HTML.
   */
  gated: string;
};

const RESOURCES_DIR = path.join(process.cwd(), "contents", "resources");

/** Display labels for domain tokens; unknown tokens get Title Case. */
const domainLabels: Record<string, string> = {
  "cloud-platform": "Cloud Platform",
  security: "Security",
  "business-systems": "Business Systems",
};

export function domainLabel(domain: string): string {
  const key = (domain || "").toLowerCase();
  return (
    domainLabels[key] ??
    key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function audienceLabel(audience: string): string {
  const key = (audience || "").toLowerCase();
  if (key === "decision-maker") return "For decision-makers";
  if (key === "practitioner") return "For practitioners";
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Strip one layer of matching single or double quotes. */
function unquote(v: string): string {
  const t = v.trim();
  if (
    (t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
    (t.startsWith("'") && t.endsWith("'") && t.length >= 2)
  ) {
    return t.slice(1, -1);
  }
  return t;
}

/**
 * Minimal frontmatter parser for the contract's flat `key: value` block.
 * Deliberately not a YAML library: the contract promises single-line
 * values only, and a tiny parser with no dependency keeps Forge's files
 * rendering the same way forever.
 */
function parseFrontmatter(
  raw: string,
): { data: Record<string, string>; body: string } | null {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (kv) data[kv[1].toLowerCase()] = unquote(kv[2]);
  }
  return { data, body: raw.slice(m[0].length) };
}

/** Drop a leading `# H1` that just repeats the title (the page renders it). */
function stripLeadingTitle(body: string, title: string): string {
  const m = body.match(/^\s*#\s+([^\n]+)\n+/);
  if (m && m[1].trim() === title.trim()) return body.slice(m[0].length);
  return body.trimStart();
}

/**
 * Cut the body into a public preview and the gated remainder, at a single
 * point so the two halves reassemble into the full document. The preview
 * is the intro (everything before the first `## ` heading), extended
 * through the first section when its heading is "When to use it" — the
 * contract's convention for what a visitor may read before unlocking.
 */
function splitBody(body: string): { preview: string; gated: string } {
  const headings = [...body.matchAll(/^##\s+[^\n]+$/gm)];
  if (headings.length === 0) {
    // No sections to gate behind; the intro is all there is to preview.
    return { preview: body.trim(), gated: "" };
  }
  const first = headings[0];
  const cut =
    /when to use/i.test(first[0]) && headings.length > 1
      ? headings[1].index
      : first.index;
  return { preview: body.slice(0, cut).trim(), gated: body.slice(cut).trim() };
}

const REQUIRED = ["title", "slug", "episode", "takeaway", "domain", "date"] as const;

function readResource(filePath: string): Resource | null {
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    console.warn(`[resources] ${path.basename(filePath)}: no frontmatter, skipped.`);
    return null;
  }
  const { data } = parsed;
  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length) {
    console.warn(
      `[resources] ${path.basename(filePath)}: missing ${missing.join(", ")}, skipped.`,
    );
    return null;
  }
  const body = stripLeadingTitle(parsed.body, data.title);
  const { preview: rawPreview, gated } = splitBody(body);
  // The contract's convention opens the body with a "**From the episode:**"
  // line; the page header already names the episode, so that one line is
  // dropped from the rendered preview (the file itself stays untouched and
  // still reads standalone).
  const preview = rawPreview
    .replace(/^\*\*From the episode:\*\*[^\n]*\n?/i, "")
    .trimStart();
  return {
    slug: data.slug,
    title: data.title,
    episode: data.episode,
    takeaway: data.takeaway,
    domain: data.domain,
    audience: data.audience ?? "",
    date: data.date,
    body,
    preview,
    gated,
  };
}

/**
 * All resources, newest first (title as a stable tie-break so same-day
 * releases keep a deterministic order). Wrapped in React cache() so one
 * render pass reads the folder at most once.
 */
export const getResources = cache(async (): Promise<Resource[]> => {
  let files: string[];
  try {
    files = fs.readdirSync(RESOURCES_DIR);
  } catch {
    return []; // Folder absent: the library simply has no episode resources yet.
  }
  const resources = files
    .filter((f) => /\.(md|markdown)$/i.test(f))
    .map((f) => readResource(path.join(RESOURCES_DIR, f)))
    .filter((r): r is Resource => r !== null);
  return resources.sort(
    (a, b) =>
      (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0) ||
      a.title.localeCompare(b.title),
  );
});

export const getResource = cache(
  async (slug: string): Promise<Resource | null> => {
    const all = await getResources();
    return all.find((r) => r.slug === slug) ?? null;
  },
);
