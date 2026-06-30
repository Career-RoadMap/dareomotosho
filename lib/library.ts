import { isSupabaseConfigured, supabase } from "./supabase";

/**
 * Content library model.
 *
 * One table powers everything: `entries`. A `type` discriminates the three
 * content models; filtering by `type`, `topic`, `level`, and `published`
 * drives every view. A second table, `interactions`, carries comments and
 * reactions for the realtime layer (see supabase/migrations).
 *
 * Everything here works with or without Supabase: when it isn't configured,
 * the seed data below is served so the library is fully browsable offline.
 */

export type EntryType = "course_qa" | "case_study" | "user_question";
export type Level = "newcomer" | "practitioner" | "executive";

export type Entry = {
  id: string;
  slug: string;
  type: EntryType;
  title: string;
  body: string; // long-form Markdown
  summary: string;
  topic: string; // e.g. cloud, cybersecurity, ai-era
  level: Level | string;
  asker: string | null; // attribution for user_question; null otherwise
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Interaction = {
  id: string;
  entry_id: string;
  kind: "comment" | "reaction";
  body: string | null;
  author: string | null;
  approved: boolean;
  created_at: string;
};

export const entryTypeMeta: Record<
  EntryType,
  { label: string; blurb: string }
> = {
  course_qa: {
    label: "Interview Prep",
    blurb: "Common interview questions and how to think about answering them, drawn from the courses.",
  },
  case_study: {
    label: "Case Studies",
    blurb: "How real systems were reasoned about, the decision, not just the diagram.",
  },
  user_question: {
    label: "FAQs",
    blurb: "Questions visitors send in most often, answered in the open.",
  },
};

export const levelLabels: Record<string, string> = {
  newcomer: "Newcomer",
  practitioner: "Practitioner",
  executive: "Executive",
};

/** Display labels for topics. The seeder emits ai_era; seed data uses ai-era. */
export const topicLabels: Record<string, string> = {
  cloud: "Cloud",
  cybersecurity: "Cybersecurity",
  ai_era: "AI",
  "ai-era": "AI",
  ai: "AI",
  cost: "Cost",
};

/** Human label for a topic, with a sensible Title-Case fallback. */
export function topicLabel(topic: string): string {
  const key = (topic || "").toLowerCase();
  return (
    topicLabels[topic] ??
    topicLabels[key] ??
    key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

const now = "2026-06-01T00:00:00.000Z";

/** Seed content, served when Supabase isn't configured. */
export const seedEntries: Entry[] = [
  {
    id: "seed-1",
    slug: "what-actually-drives-a-cloud-bill",
    type: "course_qa",
    title: "What actually drives a cloud bill?",
    summary:
      "The handful of decisions that move 80% of the number, and why most of them are architectural, not financial.",
    body: "Most cloud bills are dominated by a few line items: compute you left running, data you moved across boundaries, and storage tiers you never revisited.\n\n**The move:** treat cost as a design input. Right-size before you optimize, put a budget alarm on every account, and re-architect what is *billed*, not just what is *used*. That's how you cut spend without touching performance.",
    topic: "cost",
    level: "practitioner",
    asker: null,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-2",
    slug: "right-sizing-security-to-real-risk",
    type: "course_qa",
    title: "How do I right-size security to real risk?",
    summary:
      "A way to pick controls that fit the threat you actually face, not the one a vendor slide says you should fear.",
    body: "Start from the asset and the adversary, not the checklist. Ask: what would it cost the business if this were breached, and who realistically would try?\n\nThen match controls to that answer, strict IAM and least privilege first, because identity is where most real incidents begin.",
    topic: "cybersecurity",
    level: "practitioner",
    asker: null,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-3",
    slug: "cutting-cloud-spend-40-percent",
    type: "case_study",
    title: "Cutting cloud spend 40% with zero performance cost",
    summary:
      "A multi-cloud environment quietly bleeding budget, and the structural changes that reclaimed it.",
    body: "## The situation\nA multi-cloud environment was over-provisioned and billed for capacity it never used.\n\n## The decision\nWe treated cost as an architectural problem: careful spend analysis, budget controls per account, and structural changes to what was provisioned.\n\n## The outcome\n40% of the monthly bill reclaimed, application performance held flat. The savings were a business decision, not a tuning trick.",
    topic: "cloud",
    level: "executive",
    asker: null,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-4",
    slug: "a-central-logging-system-from-scratch",
    type: "case_study",
    title: "Building a central logging system from scratch",
    summary:
      "Designing observability around the questions an incident actually asks.",
    body: "## The gap\nDevelopers had no unified visibility; every incident started with a scavenger hunt.\n\n## The build\nA proprietary Central Logging System, ingestion, retention, and access designed around the questions teams ask under pressure.\n\n## The result\nAnswers in minutes, not hours, and operations that finally felt seamless.",
    topic: "cloud",
    level: "practitioner",
    asker: null,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-5",
    slug: "will-ai-make-cloud-skills-obsolete",
    type: "user_question",
    title: "Will AI make cloud skills obsolete?",
    summary: "The honest answer, and where the durable edge actually is.",
    body: "AI is very good at running the tools. It's far weaker at the judgment, knowing *which* system to build, and why, given the business you're in.\n\nThat judgment is the part worth building, and it's the part that lasts. Learn the tools, but invest in the thinking.",
    topic: "ai-era",
    level: "newcomer",
    asker: "asked by a learner",
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-6",
    slug: "where-should-a-newcomer-start",
    type: "user_question",
    title: "I'm new to cloud, where should I start?",
    summary: "A route, not a pile of links.",
    body: "Start with one real thing, end to end: stand up a small service, read its bill, and add the smallest sensible security. Confidence comes from shipping, not from reading.\n\nThe Start Here path lays out the order.",
    topic: "cloud",
    level: "newcomer",
    asker: "asked by a visitor",
    published: true,
    created_at: now,
    updated_at: now,
  },
];

export const topics = Array.from(new Set(seedEntries.map((e) => e.topic)));
export const levels: Level[] = ["newcomer", "practitioner", "executive"];

/** Fetch all published entries (newest first). Falls back to seed. */
export async function getEntries(): Promise<Entry[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getEntries] Supabase read failed:", error.message);
    } else if (data) {
      if (data.length === 0) {
        console.warn(
          "[getEntries] Supabase returned 0 published entries. If the table " +
            "has published rows, the anon SELECT is likely blocked by RLS — " +
            "apply supabase/migrations/0003_entries_read_policy.sql.",
        );
      }
      return data as Entry[];
    }
  }
  return seedEntries.filter((e) => e.published);
}

/** Fetch a single published entry by slug. Falls back to seed. */
export async function getEntry(slug: string): Promise<Entry | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return data as Entry;
  }
  return seedEntries.find((e) => e.slug === slug && e.published) ?? null;
}
