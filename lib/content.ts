/**
 * Sample content scaffolding.
 *
 * This is deliberately a clear SEAM for later integration: resource downloads,
 * class schedules, and case studies should come from a CMS / Supabase / R2.
 * The UI reads from these typed shapes — swap the source, keep the components.
 */

export type Level = "Newcomer" | "Practitioner" | "Architect";
export type ResourceType = "Guide" | "Checklist" | "Template" | "Talk" | "Deck";

export type Resource = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  level: Level;
  type: ResourceType;
  /** Wire to an R2 (or other object-store) signed URL at integration time. */
  downloadUrl: string | null;
  updated: string;
};

export const resources: Resource[] = [
  {
    slug: "cloud-cost-first-principles",
    title: "Cloud Cost from First Principles",
    summary:
      "A short field guide to reading a cloud bill like a P&L — where the money actually goes, and the handful of decisions that move it.",
    topic: "Cost",
    level: "Practitioner",
    type: "Guide",
    downloadUrl: null,
    updated: "2026-05-18",
  },
  {
    slug: "security-matched-to-risk",
    title: "Security Matched to Real Risk",
    summary:
      "A checklist for right-sizing controls to the threat you actually face — not the one a vendor slide says you should fear.",
    topic: "Security",
    level: "Practitioner",
    type: "Checklist",
    downloadUrl: null,
    updated: "2026-04-02",
  },
  {
    slug: "new-to-cloud-starter",
    title: "New to Cloud — The Starter Path",
    summary:
      "The ordered first steps. Not a dump of links — a route. Begin here if the words 'VPC' and 'IAM' still feel like fog.",
    topic: "Foundations",
    level: "Newcomer",
    type: "Guide",
    downloadUrl: null,
    updated: "2026-06-10",
  },
  {
    slug: "central-logging-blueprint",
    title: "Central Logging System — A Blueprint",
    summary:
      "How a central logging system (CLS) is structured from scratch: ingestion, retention, access, and the questions it must answer.",
    topic: "Infra",
    level: "Architect",
    type: "Template",
    downloadUrl: null,
    updated: "2026-03-21",
  },
  {
    slug: "the-business-case-template",
    title: "The Business-Case Template for Engineers",
    summary:
      "A one-page frame for turning a technical proposal into a decision a leader can make. Translate the floor to the boardroom.",
    topic: "Judgment",
    level: "Practitioner",
    type: "Template",
    downloadUrl: null,
    updated: "2026-02-14",
  },
  {
    slug: "delivery-speed-without-chaos",
    title: "Delivery Speed Without the Chaos",
    summary:
      "What actually let a team ship features 90% faster — and the guardrails that kept the speed from becoming debt.",
    topic: "Delivery",
    level: "Architect",
    type: "Guide",
    downloadUrl: null,
    updated: "2026-01-30",
  },
];

export type Outcome = {
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  hero?: boolean;
};

/** Outcome-led, headline-first. Metric is the protagonist. */
export const outcomes: Outcome[] = [
  {
    metric: "40%",
    metricLabel: "cloud spend reduced",
    title: "Cut cloud spend 40% — with zero performance cost.",
    body: "Re-architected what was billed, not just what was used. The bill came down; the experience didn't move. The savings were a business decision, not a tuning trick.",
    hero: true,
  },
  {
    metric: "90%",
    metricLabel: "faster to ship",
    title: "Shipped features 90% faster.",
    body: "Removed the friction between idea and production — pipelines, environments, and ownership redrawn so speed became the default, not a heroic exception.",
  },
  {
    metric: "15+",
    metricLabel: "products delivered",
    title: "Architected multi-cloud delivery for 15+ products.",
    body: "One coherent delivery model across providers — portability where it paid for itself, and a single way of working that scaled past any one team.",
  },
  {
    metric: "CLS",
    metricLabel: "built from scratch",
    title: "Built a central logging system from scratch.",
    body: "Ingestion, retention, and access designed around the questions the business actually asks in an incident — so the answer is minutes away, not hours.",
  },
];

export type Capability = {
  title: string;
  body: string;
};

export const capabilities: Capability[] = [
  {
    title: "Security & access by design",
    body: "Controls matched to real risk, built in from the first diagram — not bolted on after the audit.",
  },
  {
    title: "Advisory at the decision table",
    body: "Sitting where the trade-offs are made, translating technical reality into the language of the P&L.",
  },
  {
    title: "Monitoring, logging & strategic infra",
    body: "The systems that tell you the truth about your systems — and the infrastructure choices that age well.",
  },
  {
    title: "Leadership through mentorship",
    body: "Raising judgment, not just throughput. The people stay better than the project found them.",
  },
  {
    title: "The toolkit",
    body: "Deep, current, and quietly fluent across the stack — but always in service of the decision, never the demo.",
  },
];

export type ClassSession = {
  title: string;
  day: string;
  time: string;
  cadence: string;
  level: Level;
};

export const schedule: ClassSession[] = [
  {
    title: "Cloud, From the Ground Up",
    day: "Tuesdays",
    time: "18:00 UTC",
    cadence: "Weekly",
    level: "Newcomer",
  },
  {
    title: "Designing for the Bill",
    day: "Thursdays",
    time: "16:00 UTC",
    cadence: "Weekly",
    level: "Practitioner",
  },
  {
    title: "Architecture Office Hours",
    day: "Fridays",
    time: "15:00 UTC",
    cadence: "Fortnightly",
    level: "Architect",
  },
];

export type Episode = {
  title: string;
  guest: string;
  summary: string;
  published: string;
};

export const episodes: Episode[] = [
  {
    title: "The judgment is the job",
    guest: "Solo",
    summary:
      "Why every system an engineer builds is a business decision in disguise — and what changes when you say that part out loud.",
    published: "2026-06-12",
  },
  {
    title: "Reading a cloud bill like a P&L",
    guest: "with a CFO who learned to",
    summary:
      "A finance leader and an engineer translate each other's language until the bill finally makes sense to both.",
    published: "2026-05-29",
  },
  {
    title: "Security that fits the risk",
    guest: "with a CISO",
    summary:
      "Right-sizing controls when the threat is real but the budget is finite — and why fear is a bad architect.",
    published: "2026-05-15",
  },
];

export type TalkTopic = {
  title: string;
  audience: string;
  body: string;
};

export const talkTopics: TalkTopic[] = [
  {
    title: "Every system is a business decision in disguise",
    audience: "Engineering leadership · Platform teams",
    body: "The talk that reframes the floor: judgment, not tooling, is the scarce skill — and it can be taught.",
  },
  {
    title: "Cutting cloud spend without cutting performance",
    audience: "Cloud & FinOps tracks",
    body: "A field account of a 40% reduction with zero performance cost — and the decisions that made it durable.",
  },
  {
    title: "The translator's job",
    audience: "Keynotes · Boardrooms",
    body: "On bridging the technical floor and the boardroom — what gets lost between them, and who's paid to carry it across.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

/** FAQ is content-managed in production (editable without redeploy). Sample seed below. */
export const faqs: FaqItem[] = [
  {
    question: "I'm completely new to cloud. Where do I actually start?",
    answer:
      "Start Here is built for exactly this. It's an ordered path, not a pile of links — and the first resources are free. You don't need a background to begin; you need a route.",
  },
  {
    question: "Will AI make these skills obsolete?",
    answer:
      "AI is very good at the tool. It's far weaker at the judgment — knowing which system to build, and why, given the business you're in. That judgment is the part worth building, and it's the part that lasts.",
  },
  {
    question: "Do you work with teams as well as individuals?",
    answer:
      "Yes. Advisory is focused on helping teams and leaders build business-aligned judgment. Start with an inquiry and we'll find the right shape.",
  },
  {
    question: "How do the live classes work?",
    answer:
      "Weekly sessions by level, with replays archived afterward. Sign up on the Live page and you'll get the schedule and joining details.",
  },
];

export type BioLength = {
  label: string;
  text: string;
};

export const bios: BioLength[] = [
  {
    label: "Short (embed)",
    text: "A builder, mentor, and boardroom translator — connecting the technical floor to the decisions that fund it.",
  },
  {
    label: "Medium",
    text: "I build systems for businesses — cloud architecture that serves the P&L, security matched to real risk, and delivery at the speed the business needs. I also teach: the part of this work that lasts is judgment, and judgment can be taught.",
  },
  {
    label: "Press (long)",
    text: "I work at the seam between engineering and the business. For over a decade I've architected cloud systems, cut costs without cutting performance, built central logging and delivery platforms from scratch, and sat at the decision table translating technical reality into the language leaders use to make calls. Alongside the building, I mentor and teach — because the scarce skill in this field was never the tool. It's the judgment to know which system to build, and why.",
  },
];
