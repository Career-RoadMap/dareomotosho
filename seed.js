/* eslint-disable */
/**
 * seed.js — Google Drive → Supabase content seeder
 * ------------------------------------------------------------------
 * Reads three public Google Drive folders (Case Studies, Course Q&A,
 * User Questions), extracts every Google Doc, auto-labels each entry
 * (type / topic / level), builds title / body / summary / asker, and
 * inserts the rows into the Supabase `entries` table.
 *
 * Run locally (you need network access to Google):
 *
 *   npm install @supabase/supabase-js      # Node 18+ (global fetch)
 *   node seed.js                           # insert
 *   node seed.js --dry-run                 # print, don't insert
 *
 * Folder listing works two ways:
 *   1. PREFERRED — set a Google API key so listing uses the Drive API:
 *        GOOGLE_API_KEY=xxxx node seed.js
 *      (Create one at console.cloud.google.com → APIs & Services →
 *       Credentials → API key, and enable the Google Drive API. The
 *       folders must be shared "Anyone with the link".)
 *   2. FALLBACK — no key: the script scrapes the public folder page.
 *      Google changes that markup periodically; if it returns 0 docs,
 *      use the API key route above.
 *
 * Credentials and folders can be overridden by env vars (see CONFIG).
 */

const { createClient } = require("@supabase/supabase-js");

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://dvirmugurowkamnylbus.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aXJtdWd1cm93a2FtbnlsYnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NjYzODgsImV4cCI6MjA5ODM0MjM4OH0.BtxTv3VLrxv8WZJuRALFcZLMP1xNtGgd8PyradIx6AE";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISHED = true; // inserted rows are live; flip to false to stage for review

/** folderId → entry type, exactly as requested. */
const FOLDERS = [
  {
    name: "Case Studies",
    id: process.env.FOLDER_CASE_STUDIES || "1hIaecnbDd9F8jbdtDeWnHQqgic0fmK0K",
    type: "case_study",
  },
  {
    name: "Course Q&A",
    id: process.env.FOLDER_COURSE_QA || "1AQLWXWn_I-pLigXrcoBEozL3UEIAobY6",
    type: "course_qa",
  },
  {
    name: "User Questions",
    id: process.env.FOLDER_USER_QUESTIONS || "1eCnHRueaKYBf3oHe7KCzdLEnsDF9KW5O",
    type: "user_question",
  },
];

const DOC_MIME = "application/vnd.google-apps.document";

// ── AUTO-LABELLING RULES ──────────────────────────────────────────
// Topic: pick the topic with the most keyword hits (tie → listed order).
const TOPIC_RULES = [
  { topic: "cloud", patterns: [/\bcloud\b/gi, /\bAWS\b/gi, /\bcost(s|ing)?\b/gi, /\barchitecture\b/gi] },
  { topic: "cybersecurity", patterns: [/\bsecurity\b/gi, /\bIAM\b/gi, /\bcyber ?security\b/gi, /\bbreach(es|ed)?\b/gi] },
  { topic: "ai_era", patterns: [/\bAI\b/gi, /\bAI[ -]?era\b/gi, /\bautomation\b/gi, /\bartificial intelligence\b/gi] },
];

// Level: pick the level with the most keyword hits (tie → listed order).
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

/**
 * Case-study summary: an extractive 150–200 word abstract that leans on the
 * business challenge → decision → outcome arc. (Pure Node, no LLM. To get a
 * truly abstractive summary, pipe `body` through an LLM where marked below.)
 */
function summariseCaseStudy(body) {
  const SIGNAL =
    /\b(challenge|problem|situation|issue|context|decision|decided|chose|approach|solution|strateg|outcome|result|impact|saved|reduced|increased|grew|cut|achiev|deliver)\b/i;
  const paras = paragraphs(body);
  const allSentences = sentences(paras.join(" "));
  const picked = [];
  const seen = new Set();

  // Always open with the first sentence for context.
  if (allSentences[0]) {
    picked.push(allSentences[0]);
    seen.add(allSentences[0]);
  }
  // Then pull signal-bearing sentences (challenge / decision / outcome).
  for (const s of allSentences) {
    if (words(picked.join(" ")).length >= 190) break;
    if (seen.has(s)) continue;
    if (SIGNAL.test(s)) {
      picked.push(s);
      seen.add(s);
    }
  }
  // Top up with remaining sentences to reach the 150-word floor.
  for (const s of allSentences) {
    if (words(picked.join(" ")).length >= 150) break;
    if (seen.has(s)) continue;
    picked.push(s);
    seen.add(s);
  }
  let summary = picked.join(" ").replace(/\s+/g, " ").trim();
  return clampWords(summary, 200);

  // --- LLM upgrade (optional) -------------------------------------
  // const summary = await llm(`Summarise in 150-200 words, covering the
  //   business challenge, the decision, and the outcome:\n\n${body}`);
}

/** Q&A / question summary: first paragraph, normalised to 100–150 words. */
function summariseFirstParagraph(body) {
  const paras = paragraphs(body);
  let summary = paras[0] || body;
  // If the opener is thin, fold in following paragraphs up to ~150 words.
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
    // signature line / inline sign-off: "— Amara" or "— Jane Doe"
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

function deriveTitle(docName, body) {
  const name = (docName || "").replace(/\.(docx?|gdoc|txt|pdf)$/i, "").trim();
  if (name) return name;
  const firstLine = body.split("\n").map((l) => l.trim()).find(Boolean);
  return (firstLine || "Untitled").slice(0, 160);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "entry";
}

// ── GOOGLE DRIVE ──────────────────────────────────────────────────
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

/** List the Google Docs in a public folder — API key if present, else scrape. */
async function listDocs(folderId) {
  if (GOOGLE_API_KEY) return listDocsViaApi(folderId);
  return listDocsViaScrape(folderId);
}

async function listDocsViaApi(folderId) {
  const out = [];
  let pageToken = "";
  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", `'${folderId}' in parents and mimeType='${DOC_MIME}' and trashed=false`);
    url.searchParams.set("fields", "nextPageToken,files(id,name)");
    url.searchParams.set("pageSize", "1000");
    url.searchParams.set("key", GOOGLE_API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    for (const f of data.files || []) out.push({ id: f.id, name: f.name });
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return out;
}

async function listDocsViaScrape(folderId) {
  const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`Folder fetch ${res.status} for ${folderId}`);
  const html = await res.text();

  // Google embeds the listing as a JS-escaped JSON blob in _DRIVE_ivd.
  const m = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
  const docs = [];
  if (m) {
    const decoded = m[1]
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\\//g, "/")
      .replace(/\\\\/g, "\\");
    try {
      const data = JSON.parse(decoded);
      const files = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
      for (const f of files) {
        if (Array.isArray(f) && f[3] === DOC_MIME) {
          docs.push({ id: f[0], name: f[2] });
        }
      }
    } catch (_) {
      /* fall through to regex sweep */
    }
  }
  // Last-ditch sweep: pair any doc id with the nearest quoted name.
  if (docs.length === 0) {
    const re = /"([\w-]{25,44})"[^"]*?"([^"]{1,200}?)"[^"]*?"application\/vnd\.google-apps\.document"/g;
    let r;
    const seen = new Set();
    while ((r = re.exec(html))) {
      if (!seen.has(r[1])) {
        seen.add(r[1]);
        docs.push({ id: r[1], name: r[2] });
      }
    }
  }
  return docs;
}

/** Download a Google Doc's plain-text export. */
async function fetchDocText(docId) {
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Doc export ${res.status} for ${docId}`);
  // export?format=txt returns UTF-8 text; strip BOM.
  return (await res.text()).replace(/^﻿/, "").replace(/\r\n/g, "\n").trim();
}

// ── BUILD + INSERT ────────────────────────────────────────────────
function buildEntry({ doc, type, body }) {
  const title = deriveTitle(doc.name, body);
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

async function main() {
  console.log(`\nGoogle Drive → Supabase seeder ${DRY_RUN ? "(DRY RUN)" : ""}`);
  console.log(`Listing mode: ${GOOGLE_API_KEY ? "Drive API key" : "public-page scrape"}\n`);

  const entries = [];
  const usedSlugs = new Set();

  for (const folder of FOLDERS) {
    console.log(`📁 ${folder.name} (${folder.type}) — ${folder.id}`);
    let docs = [];
    try {
      docs = await listDocs(folder.id);
    } catch (e) {
      console.error(`   ✗ Could not list folder: ${e.message}`);
      continue;
    }
    if (docs.length === 0) {
      console.warn(
        "   ! No Google Docs found. If the folder is non-empty, set GOOGLE_API_KEY and re-run.",
      );
      continue;
    }
    console.log(`   Found ${docs.length} doc(s).`);

    for (const doc of docs) {
      try {
        const body = await fetchDocText(doc.id);
        if (!body) {
          console.warn(`   • "${doc.name}" is empty — skipped.`);
          continue;
        }
        const entry = buildEntry({ doc, type: folder.type, body });
        // de-dupe slugs within this run
        let slug = entry.slug;
        let n = 2;
        while (usedSlugs.has(slug)) slug = `${entry.slug}-${n++}`;
        entry.slug = slug;
        usedSlugs.add(slug);
        entries.push(entry);
        console.log(
          `   ✓ ${entry.title}  [topic:${entry.topic} · level:${entry.level}` +
            `${entry.asker ? ` · asker:${entry.asker}` : ""}]`,
        );
      } catch (e) {
        console.error(`   ✗ "${doc.name}": ${e.message}`);
      }
    }
  }

  console.log(`\nPrepared ${entries.length} entr${entries.length === 1 ? "y" : "ies"}.`);
  if (entries.length === 0) return;

  if (DRY_RUN) {
    console.log("\n--- DRY RUN: rows that would be inserted ---");
    console.dir(
      entries.map((e) => ({ ...e, body: e.body.slice(0, 120) + "…" })),
      { depth: null, maxArrayLength: null },
    );
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // Upsert on slug so re-running updates rather than duplicating (requires a
  // unique constraint on entries.slug; if you don't have one, change this to
  // .insert(entries) instead).
  const { data, error } = await supabase
    .from("entries")
    .upsert(entries, { onConflict: "slug" })
    .select("id,slug");

  if (error) {
    console.error("\n✗ Insert failed:", error.message);
    console.error(
      "  If the error mentions RLS, insert with the service-role key, or add a\n" +
        "  policy allowing inserts. If it mentions 'on conflict'/'slug', either add a\n" +
        "  unique index on entries.slug or switch .upsert(...) to .insert(entries).",
    );
    process.exit(1);
  }
  console.log(`\n✓ Inserted/updated ${data ? data.length : entries.length} row(s) into "entries".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
