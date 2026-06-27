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
    body: "A multi-cloud environment was quietly bleeding budget. By treating cost as an architectural decision rather than a finance problem — careful spend analysis, budgeting controls, and structural changes — I reclaimed 40% of the monthly cloud bill while holding application performance flat. Proof that the right trade-off serves the business and the system.",
    hero: true,
  },
  {
    metric: "90%",
    metricLabel: "faster to ship",
    title: "Shipped features 90% faster.",
    body: "Release cycles were a bottleneck between the team and its customers. I designed and implemented a fast continuous integration, delivery, and deployment pipeline that cut the time to push feature changes and publish to production by 90% — turning deployment from a constraint into a competitive speed.",
  },
  {
    metric: "30+",
    metricLabel: "products delivered",
    title: "Architected multi-cloud delivery for 30+ products.",
    body: "Thirty-plus software products needed seamless delivery, deployment, and integration across clouds. I architected the multi-cloud solutions that made that possible — ensuring each product reached customers reliably, and that the architecture served business value, not just technical elegance.",
  },
  {
    metric: "CLS",
    metricLabel: "built from scratch",
    title: "Built a central logging system from scratch.",
    body: "Working with internal teams, I built a proprietary Central Logging System (CLS) — a system that gave developers unified visibility and made operations seamless. A concrete artifact, built to solve a real operational gap.",
  },
];

export type Capability = {
  title: string;
  body: string;
};

/** Grouped capabilities — real, but better together than as separate cases. */
export const capabilities: Capability[] = [
  {
    title: "Security & access, by design.",
    body: "I improve the security of products, cloud services, and infrastructure through well-designed security systems built on industry-standard tools and best practices — including strict identity and access management across all services and infrastructure. The outcome isn't just safety; it's customer trust and higher product value.",
  },
  {
    title: "Advisory at the decision table.",
    body: "I provide expert guidance in stakeholder meetings on solution implementation and migration — for internal projects and 10+ external customers — focused on the same question every time: how does this maximize profit or reduce cost?",
  },
  {
    title: "Monitoring, logging, and strategic infrastructure.",
    body: "I implement infrastructure, monitoring, and logging strategically — not as afterthoughts, but as the things that maximize a product's value to its customers.",
  },
  {
    title: "Leadership through mentorship.",
    body: "I led the Cloud and Support team — mentoring engineers and steering the department toward service delivery aligned with company goals.",
  },
];

/** Closing note for the toolkit section, which is rendered as a moving marquee. */
export const toolkitNote =
  "Industry-recognized tools and services in service of value-driven solutions: compute, databases, messaging, caching, networking, monitoring and logging, work collaboration, office suites. The tools are the easy part — the judgment about which to use, and why, is the work.";

export type Tool = {
  name: string;
  /** Placeholder wordmark in /public/logos — swap for the official logo asset. */
  logo: string;
};

/** The moving toolkit marquee. Logos are placeholders to replace with real ones. */
export const toolkit: Tool[] = [
  { name: "Grafana", logo: "/logos/grafana.svg" },
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "DigitalOcean", logo: "/logos/digitalocean.svg" },
  { name: "Google Cloud", logo: "/logos/google-cloud.svg" },
  { name: "Terraform", logo: "/logos/terraform.svg" },
  { name: "Kubernetes", logo: "/logos/kubernetes.svg" },
  { name: "Docker", logo: "/logos/docker.svg" },
  { name: "Prometheus", logo: "/logos/prometheus.svg" },
  { name: "Redis", logo: "/logos/redis.svg" },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
  { name: "ClickUp", logo: "/logos/clickup.svg" },
  { name: "Excel", logo: "/logos/excel.svg" },
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
