/* eslint-disable */
/**
 * scripts/publish.js — flip the `published` switch on existing entries
 * --------------------------------------------------------------------
 * Seeding is not publishing. scripts/seed.js inserts every article with
 * `published: false` so each one can be read before it goes live, and on
 * later runs it deliberately copies the row's existing `published` value
 * back over the computed one ("never clobber a manual publish/unpublish").
 *
 * That invariant is right, and it has a consequence: re-running the seeder
 * can never publish anything. An article seeded as unpublished stays
 * unpublished for good unless something flips the switch. This is that
 * something.
 *
 * WHY A SCRIPT RATHER THAN A CLICK IN SUPABASE. The flip needs the
 * service-role key, so the only places it can happen are a browser session
 * on the Supabase dashboard or CI. Done by hand it is invisible: nothing
 * records which slug was flipped, when, or by whom, and the step is easy to
 * skip entirely — /resources/<slug> then 404s while the file sits merged in
 * the repo looking finished. Run from .github/workflows/publish.yml this
 * leaves a dated run log naming every slug, and the key never leaves CI.
 *
 * It only ever UPDATES. A slug with no row is an error, not an insert:
 * content comes from the content folders via the seeder, and a typo here
 * should fail loudly rather than quietly conjure an empty entry.
 *
 * Usage:
 *     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *       node scripts/publish.js <slug> [<slug> ...]
 *
 *     node scripts/publish.js --dry-run <slug>    # report, change nothing
 *     node scripts/publish.js --unpublish <slug>  # take a page back down
 */

const { createClient } = require("@supabase/supabase-js");

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "";
// Same reasoning as the seeder: RLS blocks the anon key from writing
// published rows, so this needs the service-role key. It is only ever used
// server-side in CI and must never reach the browser.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

const DRY_RUN = process.argv.includes("--dry-run");
const UNPUBLISH = process.argv.includes("--unpublish");
const TARGET = !UNPUBLISH;

// Accept slugs separated by whitespace, commas or newlines, so a single
// quoted workflow_dispatch input can carry several of them.
const slugs = Array.from(
  new Set(
    process.argv
      .slice(2)
      .filter((a) => !a.startsWith("--"))
      .flatMap((a) => a.split(/[\s,]+/))
      .map((s) => s.trim())
      .filter(Boolean),
  ),
);

async function main() {
  console.log(`\nEntry publisher ${DRY_RUN ? "(DRY RUN)" : ""}`);
  console.log(`Target state: published = ${TARGET}`);

  if (slugs.length === 0) {
    console.error(
      "✗ No slugs given.\n" +
        "  Usage: node scripts/publish.js <slug> [<slug> ...]\n" +
        "  The slug is the URL segment, i.e. the /resources/<slug> part — it is\n" +
        "  derived from the file's H1, not its filename, so check the seeder's\n" +
        "  log (or `node scripts/seed.js --dry-run`) rather than guessing it.",
    );
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
      "✗ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n" +
        "  Flipping `published` is blocked by row-level security for the anon key,\n" +
        "  so this needs the service-role key. In GitHub Actions they are\n" +
        "  repository secrets; locally, export them before running.",
    );
    process.exit(1);
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "! Using the anon key. The update below will almost certainly be refused\n" +
        "  by RLS — set SUPABASE_SERVICE_ROLE_KEY instead.",
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Read first, so the log says what each row was before anything moves and a
  // missing slug is reported as missing rather than as a silent no-op update.
  const { data: rows, error: readError } = await supabase
    .from("entries")
    .select("slug,title,type,published")
    .in("slug", slugs);

  if (readError) {
    console.error(`\n✗ Could not read the entries table: ${readError.message}`);
    process.exit(1);
  }

  const found = new Map((rows || []).map((r) => [r.slug, r]));
  const missing = slugs.filter((s) => !found.has(s));
  const alreadyThere = slugs.filter((s) => found.has(s) && found.get(s).published === TARGET);
  const toFlip = slugs.filter((s) => found.has(s) && found.get(s).published !== TARGET);

  console.log("");
  for (const slug of slugs) {
    const row = found.get(slug);
    if (!row) {
      console.log(`   ✗ ${slug}  [no such row]`);
    } else if (row.published === TARGET) {
      console.log(`   = ${slug}  [already published = ${TARGET}] — ${row.title}`);
    } else {
      console.log(`   → ${slug}  [${row.published} → ${TARGET}] — ${row.title}`);
    }
  }

  if (missing.length) {
    console.error(
      `\n✗ ${missing.length} slug(s) have no row in "entries": ${missing.join(", ")}\n` +
        "  Nothing was changed. Entries are created by scripts/seed.js from the\n" +
        "  content folders, so either the seeder has not run since the file\n" +
        "  landed, or the slug is wrong. This script only ever updates rows that\n" +
        "  already exist — it will not invent one.",
    );
    process.exit(1);
  }

  if (toFlip.length === 0) {
    console.log(`\nNothing to do — all ${slugs.length} row(s) are already published = ${TARGET}.`);
    return;
  }

  if (DRY_RUN) {
    console.log(`\n--- DRY RUN: ${toFlip.length} row(s) would be set to published = ${TARGET} ---`);
    for (const s of toFlip) console.log(`• ${s}`);
    return;
  }

  const { data: updated, error: writeError } = await supabase
    .from("entries")
    .update({ published: TARGET })
    .in("slug", toFlip)
    .select("slug,published");

  if (writeError) {
    console.error(`\n✗ Update failed: ${writeError.message}`);
    console.error(
      "  If it mentions RLS or permissions, the key in use is not the\n" +
        "  service-role key — the anon role has no update policy on `entries`.",
    );
    process.exit(1);
  }

  // Trust the returned rows, not the request. An update that matches nothing
  // succeeds with an empty result, and reporting that as done is exactly the
  // false receipt this script exists to stop.
  const confirmed = (updated || []).filter((r) => r.published === TARGET).map((r) => r.slug);
  const unconfirmed = toFlip.filter((s) => !confirmed.includes(s));

  if (unconfirmed.length) {
    console.error(
      `\n✗ ${unconfirmed.length} row(s) did not come back at published = ${TARGET}: ` +
        `${unconfirmed.join(", ")}\n` +
        "  The write reported no error but the rows did not change, which usually\n" +
        "  means an RLS policy silently filtered them.",
    );
    process.exit(1);
  }

  console.log(`\n✓ Set published = ${TARGET} on ${confirmed.length} row(s): ${confirmed.join(", ")}`);
  if (alreadyThere.length) {
    console.log(`  (${alreadyThere.length} already there, left alone.)`);
  }
  console.log(
    TARGET
      ? "\n/resources/<slug> sets revalidate = 60, so the page goes live within a\n" +
          "minute. It is not live because this script finished — check the URL."
      : "\nThe page will 404 within a minute, once its cached render expires.",
  );
}

main().catch((e) => {
  console.error(`\n✗ ${e && e.message ? e.message : e}`);
  process.exit(1);
});
