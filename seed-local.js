/* eslint-disable */
/**
 * seed-local.js — local folders → Supabase content seeder
 * ------------------------------------------------------------------
 * Same pipeline as seed.js, but the source is local folders instead of
 * Google Drive. Reads docs from three folders, auto-labels each entry
 * (type by folder, topic + level by content), builds title / body /
 * summary / asker, SKIPS anything already in the table (by slug), and
 * inserts the rest into the Supabase `entries` table.
 *
 * Run locally:
 *
 *   npm install @supabase/supabase-js   # Node 18+ (global fetch)
 *   # optional, only if your docs are .docx:
 *   npm install mammoth
 *
 *   node seed-local.js                  # extract + insert (skips dupes)
 *   node seed-local.js --dry-run        # print, don't insert
 *
 * Source folders (override the base with CONTENT_DIR):
 *   <CONTENT_DIR>/case-studies     → type: case_study
 *   <CONTENT_DIR>/course-qa        → type: course_qa
 *   <CONTENT_DIR>/user-questions   → type: user_question
 *
 * CONTENT_DIR defaults to ./contents. To match the absolute paths you
 * mentioned (/contents/...), run:  CONTENT_DIR=/contents node seed-local.js
 *
 * Supported file types: .md .markdown .txt .text .html .htm, and .docx
 * (only if the optional `mammoth` package is installed). Other files are
 * skipped with a notice.
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://dvirmugurowkamnylbus.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aXJtdWd1cm93a2FtbnlsYnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NjYzODgsImV4cCI6MjA5ODM0MjM4OH0.BtxTv3VLrxv8WZJuRALFcZLMP1xNtGgd8PyradIx6AE";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISHED = true; // inserted rows are live; flip to false to stage for review

const CONTENT_DIR = process.env.CONTENT_DIR || path.resolve("contents");

/**
 * Map a subfolder NAME to an entry type by keyword, so naming variations all
 * resolve correctly: "case-studies" / "case studies" → case_study,
 * "user questions" → user_question, "course-qa" / "content Q&A" → course_qa.
 * Order matters: check case → user → course/q&a.
 */
function classifyFolderType(name) {
  const n = name.toLowerCase();
  if (/case/.test(n)) return "case_study";
  if (/user/.test(n)) return "user_question";
  if (/q\s*&?\s*a|qa\b|course|content/.test(n)) return "course_qa";
  return null;
}

/** Discover seedable subfolders under the content dir. */
function discoverFolders(baseDir) {
  let dirs = [];
  try {
    dirs = fs.readdirSync(baseDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  } catch (_) {
    return [];
  }
  return dirs
    .map((d) => ({ name: d.name, dir: d.name, type: classifyFolderType(d.name) }))
    .filter((f) => f.type);
}

const TEXT_EXT = new Set([".md", ".markdown", ".txt", ".text", ".html", ".htm"]);

// ── AUTO-LABELLING RULES (identical to seed.js) ───────────────────
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

// ── TEXT HELPERS (identical to seed.js) ───────────────────────────
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

/** Case-study summary: extractive 150–200 word challenge → decision → outcome. */
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
    if (words(picked.join(" ")).length >= 190) break;
    if (seen.has(s)) continue;
    if (SIGNAL.test(s)) {
      picked.push(s);
      seen.add(s);
    }
  }
  for (const s of allSentences) {
    if (words(picked.join(" ")).length >= 150) break;
    if (seen.has(s)) continue;
    picked.push(s);
    seen.add(s);
  }
  const summary = picked.join(" ").replace(/\s+/g, " ").trim();
  return clampWords(summary, 200);
}

/** Q&A / question summary: first paragraph, normalised to 100–150 words. */
function summariseFirstParagraph(body) {
  const paras = paragraphs(body);
  let summary = paras[0] || body;
  let i = 1;
  while (words(summary).length < 100 && i < paras.length) {
    summary += " " + paras[i++];
  }
  return clampWords(summary, 150);
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

// ── LOCAL FILE READING ────────────────────────────────────────────
let mammoth = null;
try {
  mammoth = require("mammoth"); // optional, for .docx
} catch (_) {
  /* not installed — .docx files will be skipped with a notice */
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Recursively list readable doc files under a directory. */
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

/** Read a file to plain text, or return null if unsupported/unreadable. */
async function readDocFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (TEXT_EXT.has(ext)) {
    const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
    return ext === ".html" || ext === ".htm" ? stripHtml(raw) : raw.trim();
  }
  if (ext === ".docx") {
    if (!mammoth) {
      console.warn(`   • ${path.basename(file)} is .docx — run "npm install mammoth" to import it. Skipped.`);
      return null;
    }
    const { value } = await mammoth.extractRawText({ path: file });
    return (value || "").replace(/\r\n/g, "\n").trim();
  }
  console.warn(`   • ${path.basename(file)} (${ext || "no ext"}) is unsupported — skipped.`);
  return null;
}

// ── BUILD ─────────────────────────────────────────────────────────
function buildEntry({ fileName, type, body }) {
  const title = deriveTitle(fileName, body);
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
  console.log(`\nLocal folders → Supabase seeder ${DRY_RUN ? "(DRY RUN)" : ""}`);
  console.log(`Content dir: ${CONTENT_DIR}\n`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`✗ Content dir not found: ${CONTENT_DIR}`);
    console.error(`  Set CONTENT_DIR to the folder that holds case-studies/, course-qa/, user-questions/.`);
    process.exit(1);
  }

  // Pull existing slugs up front so we can skip duplicates (skips when not in DRY_RUN
  // or whenever Supabase is reachable).
  let existingSlugs = new Set();
  let supabase = null;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from("entries").select("slug");
    if (error) throw error;
    existingSlugs = new Set((data || []).map((r) => r.slug));
    console.log(`Found ${existingSlugs.size} existing row(s) in "entries" — these slugs will be skipped.\n`);
  } catch (e) {
    console.warn(`! Could not read existing slugs (${e.message}). Will rely on in-run de-dupe only.\n`);
  }

  const folders = discoverFolders(CONTENT_DIR);
  if (folders.length === 0) {
    console.error(`✗ No recognisable content subfolders under ${CONTENT_DIR}.`);
    console.error(`  Expected folders whose names imply case studies, course Q&A, or user questions.`);
    process.exit(1);
  }

  const entries = [];
  const usedSlugs = new Set();
  let skipped = 0;

  for (const folder of folders) {
    const dir = path.join(CONTENT_DIR, folder.dir);
    console.log(`📁 ${folder.name} → ${folder.type} — ${dir}`);
    const files = walk(dir);
    if (files.length === 0) {
      console.warn(`   ! No files found in ${folder.dir}/.`);
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
      if (!body) continue; // unsupported or empty (already logged)
      if (!body.trim()) {
        console.warn(`   • ${path.basename(file)} is empty — skipped.`);
        continue;
      }

      const entry = buildEntry({ fileName: path.basename(file), type: folder.type, body });

      // skip duplicates: already in DB, or already collected this run (same slug)
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
  if (entries.length === 0) return;

  if (DRY_RUN) {
    console.log("\n--- DRY RUN: rows that would be inserted ---");
    console.dir(
      entries.map((e) => ({ ...e, body: e.body.slice(0, 120) + "…" })),
      { depth: null, maxArrayLength: null },
    );
    return;
  }

  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("entries").insert(entries).select("id,slug");

  if (error) {
    console.error("\n✗ Insert failed:", error.message);
    console.error(
      "  If the error mentions RLS, insert with the service-role key or add an\n" +
        "  insert policy. If it mentions a duplicate slug, that row already exists —\n" +
        "  re-run; existing slugs are skipped automatically.",
    );
    process.exit(1);
  }
  console.log(`\n✓ Inserted ${data ? data.length : entries.length} new row(s) into "entries".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
