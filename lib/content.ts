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

/** Outcome-led, headline-first. Metric is the protagonist. (Feeds /speaking.) */
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
    body: "Designed a fast continuous integration, delivery, and deployment pipeline — cutting the time to push feature changes to production by 90%. Deployment went from bottleneck to competitive speed.",
  },
  {
    metric: "15+",
    metricLabel: "products delivered",
    title: "Architected multi-cloud delivery for 15+ products.",
    body: "Built the multi-cloud solutions that gave 15+ software products seamless delivery, deployment, and integration — architecture in service of business value, not just technical elegance.",
  },
  {
    metric: "CLS",
    metricLabel: "built from scratch",
    title: "Built a central logging system (CLS) from scratch.",
    body: "A proprietary system giving developers unified visibility and seamless operations — a concrete artifact built to close a real operational gap.",
  },
];

export type TierItem = {
  title: string;
  body: string;
  metric?: string;
  metricLabel?: string;
  /** Big-number FlipCard, full width. */
  hero?: boolean;
  /** Full-width FlipTile (a lead item without a single headline metric). */
  feature?: boolean;
};

export type Tier = {
  kicker: string;
  name: string;
  tagline: string;
  items: TierItem[];
  capabilities: string;
};

/** /work — outcome-led, building-first. Two tiers, every metric defensible. */
export const tiers: Tier[] = [
  {
    kicker: "Tier 1",
    name: "Systems built for business",
    tagline: "Commercial engineering. The foundation everything else stands on.",
    items: [
      {
        hero: true,
        metric: "40%",
        metricLabel: "cloud spend reduced",
        title: "Cut cloud spend 40% — with zero performance cost.",
        body: "Re-architected what was billed, not just what was used. The bill came down; the experience didn't move. The savings were a business decision, not a tuning trick.",
      },
      {
        title: "Shipped features 90% faster.",
        body: "Designed a fast continuous integration, delivery, and deployment pipeline — cutting the time to push feature changes to production by 90%. Deployment went from bottleneck to competitive speed.",
      },
      {
        title: "Architected multi-cloud delivery for 15+ products.",
        body: "Built the multi-cloud solutions that gave 15+ software products seamless delivery, deployment, and integration — architecture in service of business value, not just technical elegance.",
      },
      {
        title: "Built a central logging system (CLS) from scratch.",
        body: "A proprietary system giving developers unified visibility and seamless operations — a concrete artifact built to close a real operational gap.",
      },
      {
        title: "Decoupled monoliths; untangled production bottlenecks.",
        body: "Broke legacy applications into microservices and resolved the deployment and production-infrastructure bottlenecks that only surface under real load.",
      },
    ],
    capabilities:
      "Security systems & strict IAM · advisory to 10+ external customers on cost and migration trade-offs · monitoring & logging strategy · led the Cloud & Support team · emerging AI architectures.",
  },
  {
    kicker: "Tier 2",
    name: "People and delivery built at scale",
    tagline: "Because building taught me, I teach. Technical mentorship and delivery leadership.",
    items: [
      {
        feature: true,
        title: "Sustained 90%+ satisfaction across live technical delivery.",
        body: "90%+ CSAT on AWS live sessions, 91% on cybersecurity webinars, and 85% on asynchronous support with a 15-minute maximum response time — consistent quality at cohort scale.",
      },
      {
        title: "Drove certification success across large cohorts.",
        body: "Supported 2,000+ learners through certification — 240+ certifications in a single cohort, 450+ practice questions distributed weekly, 86% exam satisfaction.",
      },
      {
        title: "Cut delivery cost by re-architecting how sessions run.",
        body: "Adopted simulive delivery to maximize resources and resolve scheduling conflicts across overlapping cohorts — the same cost-as-architecture instinct, applied to teaching.",
      },
      {
        title: "Built AI into core delivery before it was standard.",
        body: "AI-generated technical podcasts, flashcards, and quizzes; automated mock exams (90% CSAT); and the introduction of NotebookLM and Gemini as organizational standards.",
      },
      {
        title: "Architected the standards others deliver by.",
        body: "Authored the Cybersecurity Technical Mentor Blueprint and co-authored the AWS Operations Playbook — the frameworks future cohorts now run on.",
      },
    ],
    capabilities:
      "AWS-certified (Cloud Practitioner + Solutions Architect Associate) · 10% operational-efficiency gain via a single source of truth · 50% retake pass-likelihood lift through targeted unblocking · organizational research contribution (Project Purple, 1,000+ respondents).",
  },
];

/** Closing line for /work. */
export const workClose =
  "These systems started as business questions. If you have one, let's talk.";

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

export type Diagram = {
  src: string;
  title: string;
  caption: string;
};

/**
 * Designed architecture diagrams — shown as an in-place gallery on /work.
 * Placeholders live in /public/diagrams; swap each for a real exported diagram
 * (and add more entries here — the gallery handles any number).
 */
export const diagrams: Diagram[] = [
  {
    src: "/diagrams/diagram-1.svg",
    title: "Application architecture",
    caption:
      "A Vendure storefront on an EC2 Docker instance, fronted by Route 53 and wired to Aurora MySQL, Agora, Google Maps, SNS, social auth, S3, and Paystack.",
  },
  {
    src: "/diagrams/diagram-2.svg",
    title: "Environments & CI",
    caption:
      "A VPC across two availability zones — staging and production EC2 behind a web-server proxy, with S3, SNS, ECS, and Git-driven automation.",
  },
  {
    src: "/diagrams/diagram-3.svg",
    title: "Observability",
    caption:
      "Lambda and API Gateway metrics into CloudWatch, with Prometheus on EKS scraping data and Grafana visualizing it.",
  },
  {
    src: "/diagrams/diagram-4.svg",
    title: "Continuous delivery",
    caption:
      "Docker Hub auto-builds and redeploys containers on every push to master from the team's GitHub repositories.",
  },
  {
    src: "/diagrams/diagram-5.svg",
    title: "Scale & resilience",
    caption:
      "A CDN and load balancer fronting containerized app instances on Kubernetes, backed by replicated Postgres with backups and firewall isolation.",
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
    text: "Builder, mentor, and boardroom translator — I build the systems that connect the technical floor to the boardroom, and grow the people who'll stand in both.",
  },
  {
    label: "Medium",
    text: "I work at the seam between engineering and the business — over five years across cloud and cybersecurity, as both an engineer and a technical mentor. I build business-aligned systems, restructure delivery to cut cost, and teach engineers to think like the business from the first system they build.",
  },
  {
    label: "Press (long)",
    text: "I work at the seam between engineering and the business — building business-aligned systems and translating the technical floor to the boardroom and back. For more than five years I've worked across cloud and cybersecurity as both an engineer and a technical mentor, staying AWS-certified in Cloud Practitioner and Solutions Architect Associate because credibility in the room depends on still being able to do the work. As a technical mentor for Udacity's Cloud Developer program, the ALX AWS program, and currently ALX Cybersecurity, I've supported thousands of engineers across large global cohorts, sustaining live-session satisfaction above 90%, and I've helped shape how these programs run — co-authoring operational playbooks and a technical-mentor blueprint and integrating AI into core delivery. As AI makes running the tools easy, the durable edge becomes judgment — knowing which trade-off, which system, serves the business. I build the systems that connect the technical floor to the boardroom, and I grow the people who'll stand in both.",
  },
];

/** Long-form bio for /about, paragraph by paragraph (author's own copy). */
export const bioStory: string[] = [
  "For more than five years I've worked across cloud and cybersecurity, as both an engineer and a technical mentor. I stay AWS-certified in Cloud Practitioner and Solutions Architect Associate not for the badge, but because credibility in the room depends on still being able to do the work. I've designed hands-on projects that simulate real business challenges, restructured delivery to cut organizational cost, and resolved the kind of IAM and architecture issues that only surface under real load.",
  "But the lesson that drives me came from teaching. As a technical mentor — for Udacity's Cloud Developer program, the ALX AWS program, and currently ALX Cybersecurity — I've supported thousands of engineers across large global cohorts, sustaining live-session satisfaction above 90% and helping learners reach certification and career readiness. Mentoring at every level isn't a side project; it's the conviction that engineers should think like the business from the first system they build.",
  "I've also helped shape how these programs work: co-authoring operational playbooks and a technical-mentor blueprint, and contributing to organization-wide initiatives — including research, female-activation strategy, and the integration of AI into core delivery. That last thread matters to me most. As AI makes running the tools easy, the durable edge becomes judgment — knowing which trade-off, which system, serves the business. So I build AI into how I work and teach, while keeping the human judgment at the center.",
];

/** A warm, human aside for /about. */
export const bioPersonal =
  "Off the cloud, you'll find me behind a drum kit, or deep in a business or psychology book chasing an idea worth building on.";

/** The closing for /about — three roles set apart from the statement. */
export const bioRoles = ["Builder", "Mentor", "Boardroom translator"];
export const bioCloseText =
  "I build the systems that connect the technical floor to the boardroom — and I grow the people who'll stand in both.";
