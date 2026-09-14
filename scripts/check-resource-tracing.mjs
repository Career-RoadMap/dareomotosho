#!/usr/bin/env node
/**
 * check-resource-tracing.mjs — keep outputFileTracingIncludes honest.
 * ------------------------------------------------------------------
 * `lib/resources.ts` reads contents/resources/ through a path built from
 * process.cwd() at runtime. Next cannot follow that statically, so every route
 * that reaches those reads has to be named by hand in `outputFileTracingIncludes`
 * (next.config.mjs) or its markdown does not travel with the serverless output.
 *
 * A hand-maintained list drifts, and this one did: /resources/field-kit,
 * /api/resources/[slug]/download and /api/resources/welcome all read the folder
 * and none of them were listed.
 *
 * THE REASON THAT DRIFT IS WORTH A CHECK RATHER THAN A NOTE: it fails silently
 * and late. The deploy is green and the pages look right, because the
 * prerendered output at build time is correct. The kits only go missing when a
 * route re-renders and finds no folder — /resources/field-kit sets
 * revalidate = 60, so in production that is a minute later, long after anyone
 * is watching the deploy. RESOURCES-CONTRACT.md promises the shelf lists every
 * kit's card and that the kit downloads as a PDF, so an untraced route breaks
 * the contract on a delay.
 *
 * WHAT COUNTS AS A READER. Reaching `lib/resources` is not enough — importing
 * `domainLabel` from it is a pure function call and reads nothing, which is
 * what `components/ResourceCard.tsx` does. Flagging that would put routes on
 * this list that have no reason to be there, and a check with false positives
 * gets weakened until it stops meaning anything. So a file is a reader only if
 * it value-imports `getResources` or `getResource`, directly or through another
 * reader. A type-only import reads nothing either and never counts.
 *
 *   node scripts/check-resource-tracing.mjs
 *   npm run check:tracing
 *
 * Exit 0 = every reader is traced. Exit 1 = the list drifted, and the output
 * names the routes to add.
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, "app");
const RESOURCES_MODULE = path.join(ROOT, "lib", "resources.ts");

/** The functions that actually touch the filesystem. */
const READING_EXPORTS = new Set(["getResources", "getResource"]);

const SOURCE_EXT = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

/** Route files Next turns into a servable path. */
const ROUTE_FILES = new Set(["page.tsx", "page.ts", "route.ts", "route.tsx"]);

/**
 * Metadata files whose route path is not their folder: app/sitemap.ts serves
 * /sitemap.xml, and the tracing key has to match the served path, not the file.
 * Getting this wrong is silent — the key is simply never matched.
 */
const METADATA_ROUTES = new Map([
  ["sitemap.ts", "/sitemap.xml"],
  ["robots.ts", "/robots.txt"],
  ["manifest.ts", "/manifest.webmanifest"],
]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** Resolve an import specifier to a file on disk, or null if it leaves the repo. */
function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // a package, not our code

  const candidates = [
    base,
    ...SOURCE_EXT.map((e) => base + e),
    ...SOURCE_EXT.map((e) => path.join(base, "index" + e)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

/**
 * Value imports only: `import type { X }` and inline `{ type X }` read nothing
 * at runtime, so they never make a file a reader.
 */
function valueImports(source) {
  const out = [];
  const re = /import\s+(type\s+)?([\s\S]*?)\s*from\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(source))) {
    const [, typeOnly, clause, spec] = m;
    if (typeOnly) continue;
    const names = [...clause.matchAll(/[{,]\s*(type\s+)?([A-Za-z_$][\w$]*)/g)]
      .filter(([, isType]) => !isType)
      .map(([, , name]) => name);
    const defaultMatch = clause.match(/^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/);
    if (defaultMatch) names.push(defaultMatch[1]);
    out.push({ spec, names });
  }
  return out;
}

/**
 * Every file that reaches a folder-reading call. Seeded with the direct
 * importers of getResources/getResource, then closed over value imports so a
 * helper module between a route and lib/resources is still caught.
 */
function findReaders() {
  const files = walk(ROOT).filter(
    (f) =>
      SOURCE_EXT.includes(path.extname(f)) &&
      (f.startsWith(APP_DIR) ||
        f.startsWith(path.join(ROOT, "lib")) ||
        f.startsWith(path.join(ROOT, "components"))),
  );

  const sources = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));
  const readers = new Set();

  // Seed: files that value-import a reading export from lib/resources.
  for (const [file, src] of sources) {
    for (const { spec, names } of valueImports(src)) {
      if (resolveImport(spec, file) !== RESOURCES_MODULE) continue;
      if (names.some((n) => READING_EXPORTS.has(n))) readers.add(file);
    }
  }

  // Close over value imports: importing from a reader makes you a reader.
  let grew = true;
  while (grew) {
    grew = false;
    for (const [file, src] of sources) {
      if (readers.has(file)) continue;
      for (const { spec } of valueImports(src)) {
        const target = resolveImport(spec, file);
        if (target && readers.has(target)) {
          readers.add(file);
          grew = true;
          break;
        }
      }
    }
  }
  return readers;
}

/** app/resources/field-kit/page.tsx -> /resources/field-kit */
function routePathFor(file) {
  const base = path.basename(file);
  const rel = path.relative(APP_DIR, file);
  if (rel.startsWith("..")) return null; // not a route at all

  const metadata = METADATA_ROUTES.get(base);
  if (metadata) {
    // Only at the app/ root; nested ones are ordinary routes.
    return path.dirname(rel) === "." ? metadata : null;
  }
  if (!ROUTE_FILES.has(base)) return null;

  const segments = path
    .dirname(rel)
    .split(path.sep)
    .filter((s) => s && s !== "." && !(s.startsWith("(") && s.endsWith(")"))); // route groups
  return "/" + segments.join("/");
}

const { default: nextConfig } = await import(
  url.pathToFileURL(path.join(ROOT, "next.config.mjs")).href
);
const traced = new Set(Object.keys(nextConfig.outputFileTracingIncludes ?? {}));

const readers = findReaders();
const routes = [...readers]
  .map((f) => ({ file: path.relative(ROOT, f), route: routePathFor(f) }))
  .filter((r) => r.route !== null)
  .sort((a, b) => a.route.localeCompare(b.route));

const missing = routes.filter((r) => !traced.has(r.route));
const stale = [...traced].filter((t) => !routes.some((r) => r.route === t)).sort();

for (const { route, file } of routes) {
  console.log(`  ${missing.some((m) => m.route === route) ? "✗" : "✓"} ${route.padEnd(32)} ${file}`);
}

if (stale.length) {
  console.log(
    `\nNote: traced but no longer reading the folder — harmless, just stale:\n` +
      stale.map((s) => `  • ${s}`).join("\n"),
  );
}

if (missing.length) {
  console.error(
    `\n✗ ${missing.length} route(s) read contents/resources/ but are missing from\n` +
      `  outputFileTracingIncludes in next.config.mjs:\n\n` +
      missing.map((m) => `    "${m.route}": ["./contents/resources/**/*"],   // ${m.file}`).join("\n") +
      `\n\n  Without the entry the markdown does not ship with that route, and its\n` +
      `  kits 404 the first time it re-renders in production — not at deploy time,\n` +
      `  which is what makes this worth failing the build over.\n`,
  );
  process.exit(1);
}

console.log(`\n✓ All ${routes.length} route(s) that read contents/resources/ are traced.`);
