/* eslint-disable */
/**
 * scripts/seed.js — content folders → Supabase seeder (CI-friendly)
 * ------------------------------------------------------------------
 * Reads docs from the content folders, auto-labels each entry (type by
 * folder, topic + level + summary by content), inserts into the Supabase
 * `entries` table, and SKIPS anything already present (by slug). Designed
 * to run unattended in GitHub Actions on every push to main.
 *
 * Credentials come from the environment (GitHub secrets) — nothing is
 * hardcoded:
 *     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * The service-role key is required to insert published rows (the anon key is
 * blocked by row-level security). SUPABASE_ANON_KEY is accepted as a fallback
 * but cannot seed published content.
 *
 * Source folders (type is inferred from the folder name, so both
 * "case-studies" and "case studies" work):
 *     case studies / case-studies      → case_study
 *     course-qa / content Q&A          → course_qa
 *     user questions / user-questions  → user_question
 *
 * The content base dir is auto-detected as ./content or ./contents
 * (override with CONTENT_DIR). Supported files: .docx, .odt, .md,
 * .markdown, .txt, .text, .html, .htm.
 *
 * Local use:
 *     npm install
 *     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.js
 *     node scripts/seed.js --dry-run        # parse + label, no insert
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "";
// The seeder writes published rows, which RLS forbids for the public anon key
// (see supabase/migrations: the only anon insert policy is unpublished
// user_questions). Prefer the service-role key, which bypasses RLS — it is only
// ever used here, server-side in CI, and must never be exposed to the browser.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISHED = true; // inserted rows are live; set false to stage for review

const TEXT_EXT = new Set([".md", ".markdown", ".txt", ".text", ".html", ".htm"]);

/** Resolve the content base dir: explicit override, else ./content or ./contents. */
function resolveContentDir() {
  if (process.env.CONTENT_DIR) return path.resolve(process.env.CONTENT_DIR);
  for (const c of ["content", "contents"]) {
    const p = path.resolve(c);
    if (fs.existsSync(p)) return p;
  }
  return path.resolve("content");
}
const CONTENT_DIR = resolveContentDir();

/** Map a subfolder name → entry type. Order matters: case → user → course/q&a. */
function classifyFolderType(name) {
  const n = name.toLowerCase();
  if (/case/.test(n)) return "case_study";
  if (/user/.test(n)) return "user_question";
  if (/q\s*&?\s*a|qa\b|course|content/.test(n)) return "course_qa";
  return null;
}

function discoverFolders(baseDir) {
  let dirs = [];
  try {
    dirs = fs.readdirSync(baseDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  } catch (_) {
    return [];
  }
  return dirs
    .map((d) => ({ name: d.name, type: classifyFolderType(d.name) }))
    .filter((f) => f.type);
}

// ── AUTO-LABELLING RULES ──────────────────────────────────────────
const TOPIC_RULES = [
  { topic: "cloud", patterns: [/\bcloud\b/gi, /\bAWS\b/gi, /\bcost(s|ing)?\b/gi, /\barchitecture\b/gi] },
  { topic: "cybersecurity", patterns: [/\bsecurity\b/gi, /\bIAM\b/gi, /\bcyber ?security\b/gi, /\bbreach(es|ed)?\b/gi] },
  { topic: "ai_era", patterns: [/\bAI\b/gi, /\bAI[ -]?era\b/gi, /\bautomation\b/gi, /\bartificial intelligence\b/gi] },
];

const LEVEL_RULES = [
  { level: "newcomer", patterns: [/\bbeginner\b/gi, /\bstart(ing|er)?\b/gi, /\bnew\b/gi, /\bintro(duction|ductory)?\b/gi] },
  { level: "practitioner", patterns: [/\bintermediate\b/gi, /\bpractitioner\b/gi, /\bengineer(s|ing)?\b/gi] },
  { level: "executive", patterns: [/\badvanced\b/gi, /\bexecutive\b/gi, /\bC-?suite\b/gi, /\bboardroom\b/gi] },
];

function countHits(text, patterns) {
  return patterns.reduce((sum, re) => {
    const m = text.match(re);
    return sum + (m ? m.length : 0);
  }, 0);
}

function classify(text, rules, key, fallback) {
  let best = { label: fallback, hits: 0 };
  for (const rule of rules) {
    const hits = countHits(text, rule.patterns);
    if (hits > best.hits) best = { label: rule[key], hits };
  }
  return best.label;
}

const classifyTopic = (text) => classify(text, TOPIC_RULES, "topic", "cloud");
const classifyLevel = (text) => classify(text, LEVEL_RULES, "level", "practitioner");

// ── TEXT HELPERS ──────────────────────────────────────────────────
function words(str) {
  return str.trim().split(/\s+/).filter(Boolean);
}

function paragraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function sentences(text) {
  return (text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);
}

function clampWords(str, max) {
  const w = words(str);
  if (w.length <= max) return str.trim();
  return w.slice(0, max).join(" ").replace(/[,;:.\s]+$/, "") + "…";
}

/** Trim to a max character count on a word boundary. */
function clampChars(str, max) {
  const t = (str || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > 0 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, "") + "…";
}

/** Every content-library summary is capped at this many characters. */
const SUMMARY_MAX_WORDS = 100; // upper bound before the character cap applies
const SUMMARY_MAX_CHARS = 200;

/** Case-study summary: extractive challenge → decision → outcome, ≤200 chars. */
function summariseCaseStudy(body) {
  const SIGNAL =
    /\b(challenge|problem|situation|issue|context|decision|decided|chose|approach|solution|strateg|outcome|result|impact|saved|reduced|increased|grew|cut|achiev|deliver)\b/i;
  const paras = paragraphs(body);
  const allSentences = sentences(paras.join(" "));
  const picked = [];
  const seen = new Set();

  if (allSentences[0]) {
    picked.push(allSentences[0]);
    seen.add(allSentences[0]);
  }
  for (const s of allSentences) {
    if (words(picked.join(" ")).length >= SUMMARY_MAX_WORDS) break;
    if (seen.has(s)) continue;
    if (SIGNAL.test(s)) {
      picked.push(s);
      seen.add(s);
    }
  }
  for (const s of allSentences) {
    if (words(picked.join(" ")).length >= SUMMARY_MAX_WORDS) break;
    if (seen.has(s)) continue;
    picked.push(s);
    seen.add(s);
  }
  const summary = picked.join(" ").replace(/\s+/g, " ").trim();
  return clampChars(clampWords(summary, SUMMARY_MAX_WORDS), SUMMARY_MAX_CHARS);
}

/** Q&A / question summary: first paragraph(s), capped at 200 chars. */
function summariseFirstParagraph(body) {
  const paras = paragraphs(body);
  let summary = paras[0] || body;
  let i = 1;
  while (words(summary).length < SUMMARY_MAX_WORDS && i < paras.length) {
    summary += " " + paras[i++];
  }
  return clampChars(clampWords(summary, SUMMARY_MAX_WORDS), SUMMARY_MAX_CHARS);
}

/** Pull an attributed name if the doc carries one; otherwise null. */
function extractAsker(body) {
  const patterns = [
    /\b(?:asked|submitted|sent|written|posed)\s+by[:\s]+([A-Z][\w.''-]+(?:\s+[A-Z][\w.''-]+){0,2})/,
    /\bquestion\s+from[:\s]+([A-Z][\w.''-]+(?:\s+[A-Z][\w.''-]+){0,2})/i,
    /\basker[:\s]+([A-Z][\w.''-]+(?:\s+[A-Z][\w.''-]+){0,2})/i,
    /\b(?:from|by)[:\s]+([A-Z][\w.''-]+\s+[A-Z][\w.''-]+)\s*$/m,
    /[—–-]{1,2}\s*([A-Z][\w.''-]+(?:\s+[A-Z][\w.''-]+){0,2})\s*$/m,
  ];
  const STOP = /^(The|This|That|These|Those|Here|There|When|While|Most|Yes|No|Short|Answer|Is|It|And|But|So)\b/;
  for (const re of patterns) {
    const m = body.match(re);
    if (m && m[1]) {
      const name = m[1].trim().replace(/[.,;:!?'"]+$/, "").trim();
      if (name && !STOP.test(name)) return name;
    }
  }
  return null;
}

/** Title: first markdown/H1 heading, else the file name. */
function deriveTitle(fileName, body) {
  const heading = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /^#{1,3}\s+\S/.test(l));
  if (heading) return heading.replace(/^#{1,3}\s+/, "").trim().slice(0, 160);
  const name = (fileName || "").replace(/\.[a-z0-9]+$/i, "").trim();
  if (name) return name;
  const firstLine = body.split("\n").map((l) => l.trim()).find(Boolean);
  return (firstLine || "Untitled").slice(0, 160);
}

function slugify(str) {
  return (
    str
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "entry"
  );
}

// ── FILE READERS ──────────────────────────────────────────────────
let mammoth = null;
try {
  mammoth = require("mammoth"); // .docx
} catch (_) {}
let AdmZip = null;
try {
  AdmZip = require("adm-zip"); // .odt
} catch (_) {}

function decodeEntities(s) {
  return s
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/gi, "&");
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** ODF (.odt) text: paragraphs/headings become newlines, then strip XML. */
function odtXmlToText(xml) {
  return decodeEntities(
    xml
      .replace(/<text:line-break\s*\/>/gi, "\n")
      .replace(/<text:tab\s*\/>/gi, "\t")
      .replace(/<\/text:(p|h)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function readDocFile(file) {
  const ext = path.extname(file).toLowerCase();

  if (TEXT_EXT.has(ext)) {
    const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
    return ext === ".html" || ext === ".htm" ? stripHtml(raw) : raw.trim();
  }
  if (ext === ".docx") {
    if (!mammoth) {
      console.warn(`   • ${path.basename(file)} is .docx — install "mammoth". Skipped.`);
      return null;
    }
    const { value } = await mammoth.extractRawText({ path: file });
    return (value || "").replace(/\r\n/g, "\n").trim();
  }
  if (ext === ".odt") {
    if (!AdmZip) {
      console.warn(`   • ${path.basename(file)} is .odt — install "adm-zip". Skipped.`);
      return null;
    }
    const entry = new AdmZip(file).getEntry("content.xml");
    if (!entry) {
      console.warn(`   • ${path.basename(file)} has no content.xml — skipped.`);
      return null;
    }
    return odtXmlToText(entry.getData().toString("utf8"));
  }
  console.warn(`   • ${path.basename(file)} (${ext || "no ext"}) is unsupported — skipped.`);
  return null;
}

/** Recursively list files under a directory. */
function walk(dir) {
  const out = [];
  let items = [];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return out;
  }
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** If the body opens with a heading equal to the title, drop it so the page
 *  doesn't render the title twice (it's already shown from `title`). */
function stripLeadingTitleHeading(body, title) {
  const m = body.match(/^﻿?\s*#{1,3}\s+([^\n]+)\n+/);
  if (m && m[1].trim() === title) return body.slice(m[0].length).trimStart();
  return body;
}

/** Replace em dashes with conventional punctuation (site-wide house style). */
function normalizeDashes(str) {
  return (str || "")
    .replace(/[ \t]*—[ \t]*\n/g, ",\n")
    .replace(/[ \t]*—[ \t]*/g, ", ");
}

// ── BUILD ─────────────────────────────────────────────────────────
function buildEntry({ fileName, type, body }) {
  const title = normalizeDashes(deriveTitle(fileName, body));
  body = normalizeDashes(stripLeadingTitleHeading(body, deriveTitle(fileName, body)));
  const topic = classifyTopic(body);
  const level = classifyLevel(body);
  const summary =
    type === "case_study" ? summariseCaseStudy(body) : summariseFirstParagraph(body);
  const asker = extractAsker(body);
  const nowIso = new Date().toISOString();
  return {
    slug: slugify(title),
    type,
    title,
    body,
    summary,
    topic,
    level,
    asker,
    published: PUBLISHED,
    created_at: nowIso,
    updated_at: nowIso,
  };
}

// ── MAIN ──────────────────────────────────────────────────────────
async function main() {
  console.log(`\nContent → Supabase seeder ${DRY_RUN ? "(DRY RUN)" : ""}`);
  console.log(`Content dir: ${CONTENT_DIR}`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`✗ Content dir not found: ${CONTENT_DIR}`);
    process.exit(1);
  }
  if (!DRY_RUN && (!SUPABASE_URL || !SUPABASE_KEY)) {
    console.error(
      "✗ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n" +
        "  Inserting published rows needs the service-role key (the anon key is\n" +
        "  blocked by row-level security). In GitHub Actions add them as repository\n" +
        "  secrets; locally export them before running, or use --dry-run to parse\n" +
        "  without inserting.",
    );
    process.exit(1);
  }
  if (!DRY_RUN && !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "! Using the anon key. Inserting published rows will likely fail RLS —\n" +
        "  set SUPABASE_SERVICE_ROLE_KEY to seed.",
    );
  }

  const folders = discoverFolders(CONTENT_DIR);
  if (folders.length === 0) {
    console.error(`✗ No recognisable content subfolders under ${CONTENT_DIR}.`);
    process.exit(1);
  }

  // Pull existing slugs so duplicates are skipped.
  let existingSlugs = new Set();
  let supabase = null;
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.from("entries").select("slug");
      if (error) throw error;
      existingSlugs = new Set((data || []).map((r) => r.slug));
      console.log(`Existing rows: ${existingSlugs.size} (their slugs will be skipped).`);
    } catch (e) {
      if (!DRY_RUN) {
        console.error(`✗ Could not read existing slugs: ${e.message}`);
        process.exit(1);
      }
      console.warn(`! Could not read existing slugs (${e.message}). In-run de-dupe only.`);
    }
  }
  console.log("");

  const entries = [];
  const usedSlugs = new Set();
  let skipped = 0;

  for (const folder of folders) {
    const dir = path.join(CONTENT_DIR, folder.name);
    console.log(`📁 ${folder.name} → ${folder.type} — ${dir}`);
    const files = walk(dir);
    if (files.length === 0) {
      console.warn(`   ! No files found.`);
      continue;
    }

    for (const file of files) {
      let body;
      try {
        body = await readDocFile(file);
      } catch (e) {
        console.error(`   ✗ ${path.basename(file)}: ${e.message}`);
        continue;
      }
      if (!body || !body.trim()) {
        if (body !== null) console.warn(`   • ${path.basename(file)} is empty — skipped.`);
        continue;
      }

      const entry = buildEntry({ fileName: path.basename(file), type: folder.type, body });

      if (existingSlugs.has(entry.slug)) {
        console.log(`   ↺ ${entry.title}  [already in the table — skipped]`);
        skipped++;
        continue;
      }
      if (usedSlugs.has(entry.slug)) {
        console.log(`   ↺ ${entry.title}  [duplicate within this run — skipped]`);
        skipped++;
        continue;
      }
      usedSlugs.add(entry.slug);
      entries.push(entry);
      console.log(
        `   ✓ ${entry.title}  [topic:${entry.topic} · level:${entry.level}` +
          `${entry.asker ? ` · asker:${entry.asker}` : ""}]`,
      );
    }
  }

  console.log(
    `\nPrepared ${entries.length} new entr${entries.length === 1 ? "y" : "ies"}` +
      `${skipped ? `, skipped ${skipped} duplicate(s)` : ""}.`,
  );
  if (entries.length === 0) {
    console.log("Nothing to insert. Done.");
    return;
  }

  if (DRY_RUN) {
    console.log("\n--- DRY RUN: rows that would be inserted ---");
    for (const e of entries) {
      console.log(`• [${e.type}] ${e.title} (slug:${e.slug}, topic:${e.topic}, level:${e.level})`);
    }
    return;
  }

  const { data, error } = await supabase.from("entries").insert(entries).select("id,slug");
  if (error) {
    console.error("\n✗ Insert failed:", error.message);
    console.error(
      "  If it mentions RLS, add an insert policy or use the service-role key.\n" +
        "  If it mentions a duplicate slug, that row exists — re-run; dupes are skipped.",
    );
    process.exit(1);
  }
  console.log(`\n✓ Inserted ${data ? data.length : entries.length} new row(s) into "entries".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
