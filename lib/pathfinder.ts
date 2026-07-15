/**
 * Cloud Career Path Finder: questions, role tracks, and scoring.
 *
 * Each answer adds weight toward one or more tracks; the highest total wins
 * (ties break by the order tracks are declared). Salary figures mirror the
 * Role & Salary Explorer reference tool and carry the same education-only
 * caveat. Resource links point only at content that ships published.
 */

export type TrackId =
  | "cloud-engineer"
  | "cybersecurity"
  | "devops-sre"
  | "solutions-architect"
  | "ai-era-cloud"
  | "security-grc"
  | "offensive-security";

/** One letter per pole of the four temperament dichotomies (16-type model). */
export type TemperamentLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type Option = {
  label: string;
  detail?: string;
  weights: Partial<Record<TrackId, number>>;
  /** Set on temperament questions; contributes a letter to the 4-letter code. */
  letter?: TemperamentLetter;
};

export type Question = {
  id: string;
  prompt: string;
  options: Option[];
};

export const questions: Question[] = [
  {
    id: "background",
    prompt: "Where are you starting from?",
    options: [
      {
        label: "No tech background yet",
        detail: "Career switcher, or starting fresh",
        weights: { "cloud-engineer": 2, cybersecurity: 1 },
      },
      {
        label: "IT support or sysadmin",
        detail: "Helpdesk, networks, on-prem systems",
        weights: { "cloud-engineer": 2, "devops-sre": 1, cybersecurity: 1 },
      },
      {
        label: "Software developer",
        detail: "You write code already",
        weights: { "devops-sre": 2, "ai-era-cloud": 2 },
      },
      {
        label: "Business, analyst, or management role",
        detail: "You speak the boardroom's language",
        weights: { "solutions-architect": 3 },
      },
    ],
  },
  {
    id: "problems",
    prompt: "Which problem would you happily lose an afternoon to?",
    options: [
      {
        label: "Building a system and watching it run",
        detail: "Servers, networks, moving parts that click",
        weights: { "cloud-engineer": 2, "devops-sre": 1 },
      },
      {
        label: "Figuring out how someone could break in",
        detail: "Threats, defenses, the attacker's mindset",
        weights: { cybersecurity: 3 },
      },
      {
        label: "Automating away repetitive work",
        detail: "Pipelines, scripts, one-click deploys",
        weights: { "devops-sre": 3 },
      },
      {
        label: "Explaining a hard trade-off so a leader can decide",
        detail: "The decision inside the system",
        weights: { "solutions-architect": 3 },
      },
      {
        label: "Making AI actually useful and trustworthy",
        detail: "Models, data, and the judgment around them",
        weights: { "ai-era-cloud": 3 },
      },
    ],
  },
  {
    id: "style",
    prompt: "What working style fits you best?",
    options: [
      {
        label: "Deep mastery of one domain",
        detail: "Go narrow, go far",
        weights: { cybersecurity: 2, "ai-era-cloud": 1 },
      },
      {
        label: "The broad view, many systems at once",
        detail: "Connect the pieces",
        weights: { "solutions-architect": 2, "cloud-engineer": 1 },
      },
      {
        label: "Calm under fire when things break",
        detail: "Incidents, on-call, fast diagnosis",
        weights: { "devops-sre": 2, cybersecurity: 1 },
      },
      {
        label: "Steady building, visible progress",
        detail: "Ship, measure, improve",
        weights: { "cloud-engineer": 2, "devops-sre": 1 },
      },
    ],
  },
  // ── Temperament (16-type model): one question per dichotomy. Each answer
  // contributes a letter to the visitor's 4-letter code and a nudge toward
  // the tracks that temperament tends to thrive in. ──
  {
    id: "energy",
    prompt: "Where does your energy come from on a working day?",
    options: [
      {
        label: "Rooms and conversations",
        detail: "Aligning people, talking a problem out",
        letter: "E",
        weights: { "solutions-architect": 2, "security-grc": 1 },
      },
      {
        label: "Quiet, uninterrupted deep work",
        detail: "Headphones on, problem open",
        letter: "I",
        weights: { "cloud-engineer": 1, "offensive-security": 1, "ai-era-cloud": 1 },
      },
    ],
  },
  {
    id: "information",
    prompt: "Meeting a new system for the first time, what do you trust?",
    options: [
      {
        label: "The concrete: docs, runbooks, what's proven",
        detail: "Facts first, then conclusions",
        letter: "S",
        weights: { "security-grc": 2, "cloud-engineer": 1, "devops-sre": 1 },
      },
      {
        label: "The pattern: what it resembles, where it's going",
        detail: "The big picture first, details after",
        letter: "N",
        weights: { "ai-era-cloud": 2, "solutions-architect": 1 },
      },
    ],
  },
  {
    id: "decisions",
    prompt: "A hard call lands on you. What wins?",
    options: [
      {
        label: "The most defensible logic, even if unpopular",
        detail: "Correctness over comfort",
        letter: "T",
        weights: { "offensive-security": 1, "devops-sre": 1, "ai-era-cloud": 1 },
      },
      {
        label: "The impact on the people involved",
        detail: "Decisions land on humans first",
        letter: "F",
        weights: { "solutions-architect": 2, "security-grc": 1 },
      },
    ],
  },
  {
    id: "structure",
    prompt: "Your best week is…",
    options: [
      {
        label: "Planned and closed-out",
        detail: "Structure, checklists, loops closed",
        letter: "J",
        weights: { "security-grc": 2, "cloud-engineer": 1, "devops-sre": 1 },
      },
      {
        label: "Adaptive and open-ended",
        detail: "Responding to what the day brings",
        letter: "P",
        weights: { "offensive-security": 2, cybersecurity: 1 },
      },
    ],
  },
  {
    id: "timeline",
    prompt: "How much runway are you giving this?",
    options: [
      {
        label: "3 to 6 months, full push",
        detail: "Treating it like a job",
        weights: {},
      },
      {
        label: "6 to 12 months alongside work",
        detail: "Evenings and weekends",
        weights: {},
      },
      {
        label: "1 to 2 years, steady and unhurried",
        detail: "Compounding beats cramming",
        weights: {},
      },
    ],
  },
];

/** Pacing note keyed by the timeline answer's index. */
export const pacingNotes = [
  "On a full push, treat the roadmap below as consecutive sprints: one stage every 4 to 6 weeks, with the project built alongside stage two, not after.",
  "Alongside work, give each stage roughly a quarter. Protect two fixed sessions a week; consistency will beat intensity over a year.",
  "On a steady runway, let each stage breathe for a few months and revisit earlier ones as you go. Depth compounds, and you'll arrive with fewer gaps than the crammers.",
];

export type Track = {
  id: TrackId;
  title: string;
  tagline: string;
  whyItFits: string;
  /** Annual reference ranges from the Role & Salary Explorer (USD / NGN). */
  salary: { level: string; usd: string; ngn: string }[];
  roadmap: { step: string; body: string }[];
  certifications: string[];
  firstProject: string;
  resources: { href: string; label: string }[];
};

export const tracks: Track[] = [
  {
    id: "cloud-engineer",
    title: "Cloud Engineer, growing into Cloud Architect",
    tagline: "The builder's route: stand systems up, run them well, then design them.",
    whyItFits:
      "You want to build real systems and see them run, and this track has the clearest entry ramp in tech: fundamentals are learnable from zero, every skill stacks toward architecture, and demand stays broad across industries.",
    salary: [
      { level: "Entry", usd: "$90,000", ngn: "₦2,400,000" },
      { level: "Mid", usd: "$168,000", ngn: "₦6,600,000" },
      { level: "Senior / Architect", usd: "$210,000", ngn: "₦13,000,000" },
    ],
    roadmap: [
      { step: "Linux & systems fundamentals", body: "The floor everything else stands on: the shell, networking basics, how servers actually work." },
      { step: "Cloud foundations", body: "Core AWS services, the shared-responsibility line, and reading your first bill." },
      { step: "Infrastructure as code", body: "Terraform and repeatable environments; stop clicking, start declaring." },
      { step: "Architecture & trade-offs", body: "Designing for cost, resilience, and the business decision inside every system." },
    ],
    certifications: ["AWS Cloud Practitioner", "AWS Solutions Architect Associate"],
    firstProject:
      "Host a real static site on S3 behind CloudFront, then read the bill line by line and write down what each charge is for.",
    resources: [
      { href: "/resources/what-is-an-ec2-instance", label: "What is an EC2 instance?" },
      { href: "/resources/service-models-vs-deployment-models-what-s-the-difference", label: "Service models vs deployment models" },
      { href: "/resources/what-s-a-simple-first-project-to-practice-aws", label: "A simple first project to practice AWS" },
      { href: "/resources/downloads", label: "Well-Architected Framework guide (free download)" },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    tagline: "The defender's route: think like the attacker, protect what the business runs on.",
    whyItFits:
      "You're drawn to the adversarial puzzle: how systems get broken and how to stop it. Security rewards exactly that mindset, pays a premium for judgment over tooling, and only grows as more of the business moves online.",
    salary: [
      { level: "Entry", usd: "$85,000", ngn: "₦2,100,000" },
      { level: "Mid", usd: "$152,000", ngn: "₦5,400,000" },
      { level: "Senior / Lead", usd: "$195,000", ngn: "₦9,000,000" },
    ],
    roadmap: [
      { step: "Network & security fundamentals", body: "How traffic moves and where it's exposed; the Security+ body of knowledge." },
      { step: "SOC analyst skills", body: "Reading logs, triaging alerts, and knowing normal so you can spot abnormal." },
      { step: "Threat hunting & incident response", body: "From reacting to hunting: investigation, containment, and post-mortems." },
      { step: "Security leadership", body: "Sizing controls to real risk and defending that judgment at the decision table." },
    ],
    certifications: ["CompTIA Security+", "CISSP (later, with experience)"],
    firstProject:
      "Build a small AWS environment, lock it down with IAM and security groups, then try to break into it yourself and document every gap you find.",
    resources: [
      { href: "/resources/iam-vs-security-groups-what-s-the-difference", label: "IAM vs security groups" },
      { href: "/resources/how-do-s3-block-public-access-iam-policies-and-bucket-policies-relate", label: "S3 Block Public Access, IAM & bucket policies" },
      { href: "/resources/case-studies", label: "Breach case studies (boardroom-level)" },
      { href: "/resources/if-security-groups-are-stateful-why-do-they-have-outbound-rules", label: "Why stateful security groups have outbound rules" },
    ],
  },
  {
    id: "devops-sre",
    title: "DevOps / Site Reliability Engineer",
    tagline: "The automator's route: make shipping boring and outages rare.",
    whyItFits:
      "You already think in code and you'd rather automate a task than repeat it. DevOps sits exactly there: pipelines, containers, and reliability engineering, where every hour you invest removes toil for a whole team.",
    salary: [
      { level: "Entry", usd: "$88,000", ngn: "₦2,400,000" },
      { level: "Mid", usd: "$158,000", ngn: "₦6,000,000" },
      { level: "Senior / Lead", usd: "$205,000", ngn: "₦10,000,000" },
    ],
    roadmap: [
      { step: "Scripting & automation", body: "Bash and Python for glue work; if you do it twice, script it." },
      { step: "Containers & CI/CD", body: "Docker, pipelines, and the discipline of small, reversible releases." },
      { step: "Cloud-native operations", body: "Kubernetes, observability, and infrastructure that heals itself." },
      { step: "Reliability engineering", body: "SLOs, incident command, and the economics of nines." },
    ],
    certifications: ["AWS DevOps Engineer Professional", "CKA (Kubernetes)"],
    firstProject:
      "Containerize any app you've written and ship it through a pipeline that tests, builds, and deploys on every push.",
    resources: [
      { href: "/resources/what-is-a-docker-image", label: "What is a Docker image?" },
      { href: "/resources/ec2-auto-scaling-vs-aws-auto-scaling-why-have-both", label: "EC2 Auto Scaling vs AWS Auto Scaling" },
      { href: "/resources/snapshot-vs-backup-what-s-the-difference", label: "Snapshot vs backup" },
      { href: "/resources/what-is-serverless-does-it-really-mean-no-server", label: "What is serverless, really?" },
    ],
  },
  {
    id: "solutions-architect",
    title: "Business-Aligned Solutions Architect",
    tagline: "The translator's route: carry decisions between the technical floor and the boardroom.",
    whyItFits:
      "Your edge is the room most engineers avoid: you can hold the business case and the technical trade-off in the same sentence. Solutions architecture is where that translation becomes the whole job, and it's the skill AI is furthest from replacing.",
    salary: [
      { level: "Entry", usd: "$90,000", ngn: "₦2,400,000" },
      { level: "Mid", usd: "$168,000", ngn: "₦6,600,000" },
      { level: "Senior / Principal", usd: "$210,000", ngn: "₦13,000,000" },
    ],
    roadmap: [
      { step: "Cloud foundations", body: "Enough hands-on depth that your diagrams describe things you could build." },
      { step: "Architecture patterns", body: "The recurring shapes: three tiers, queues, caches, and when each earns its keep." },
      { step: "Cost & trade-off fluency", body: "Reading bills, sizing risk, and framing 'it depends' with numbers." },
      { step: "Executive communication", body: "Presenting a technical decision as the business decision it already is." },
    ],
    certifications: ["AWS Solutions Architect Associate", "AWS Solutions Architect Professional"],
    firstProject:
      "Take an app you know well, draw its architecture end to end, and present the three biggest trade-offs in it to a non-technical friend until they can repeat them back.",
    resources: [
      { href: "/resources/solutions-architect-or-devops-which-path-actually-fits-how-you-think", label: "Solutions Architect or DevOps: which fits how you think?" },
      { href: "/resources/what-free-tools-can-you-use-to-draw-architecture-diagrams", label: "Free tools for architecture diagrams" },
      { href: "/resources/case-studies", label: "Boardroom case studies" },
      { href: "/resources/downloads", label: "Well-Architected Framework guide (free download)" },
    ],
  },
  {
    id: "ai-era-cloud",
    title: "AI-Era Cloud Engineer",
    tagline: "The frontier route: run the platforms that AI actually lives on.",
    whyItFits:
      "You write code and you want to be where the frontier is moving. AI systems still need cloud platforms, data pipelines, and cost discipline underneath them, and engineers who hold both sides are the scarcest profile in the market.",
    salary: [
      { level: "Entry", usd: "$110,000", ngn: "₦3,000,000" },
      { level: "Mid", usd: "$175,000", ngn: "₦7,200,000" },
      { level: "Senior", usd: "$240,000", ngn: "₦12,000,000" },
    ],
    roadmap: [
      { step: "Python & data fundamentals", body: "The lingua franca of everything AI touches." },
      { step: "Cloud & ML services", body: "The managed AI services, what they cost, and where they fail." },
      { step: "ML fundamentals", body: "Enough theory to know what the model can and cannot be trusted with." },
      { step: "MLOps & production AI", body: "Deploying, monitoring, and verifying AI systems the business can rely on." },
    ],
    certifications: ["AWS Machine Learning Specialty"],
    firstProject:
      "Deploy a small inference endpoint on a managed service, put a real request through it, and measure its latency and its cost per thousand calls.",
    resources: [
      { href: "/resources/rekognition-vs-comprehend-how-do-they-differ", label: "Rekognition vs Comprehend" },
      { href: "/resources/which-aws-specialization-should-you-bet-on-for-the-future", label: "Which AWS specialization to bet on" },
      { href: "/resources/articles", label: "Articles on AI, cloud, and judgment" },
      { href: "/resources/downloads", label: "Breaking into cloud while AI writes the code (free download)" },
    ],
  },
  {
    id: "security-grc",
    title: "Security Governance, Risk & Compliance (GRC)",
    tagline: "The assurance route: turn regulatory obligations into controls a business can live with.",
    whyItFits:
      "You bring structure, and you're at your best when the loop is closed and defensible. GRC is where that temperament becomes a career: translating regulation into controls, evidencing that they hold, and being the person an auditor and an engineer both trust.",
    salary: [
      { level: "Entry", usd: "$105,000", ngn: "₦3,000,000" },
      { level: "Mid", usd: "$145,000", ngn: "₦6,000,000" },
      { level: "Senior / CPO track", usd: "$210,000", ngn: "₦10,500,000" },
    ],
    roadmap: [
      { step: "Security fundamentals", body: "The Security+ body of knowledge: what the controls are actually protecting." },
      { step: "Frameworks & regulation", body: "ISO 27001, SOC 2, GDPR and friends: what they demand and why they exist." },
      { step: "Risk assessment & audit practice", body: "Gap assessments, evidence, and writing findings people act on." },
      { step: "Governance leadership", body: "Sizing controls to real risk and making them hold while the business ships." },
    ],
    certifications: ["CompTIA Security+", "ISACA CISA (later, with experience)"],
    firstProject:
      "Run a gap assessment of a small AWS environment against the CIS benchmark, then present the top five risks with a remediation plan a non-technical manager could approve.",
    resources: [
      { href: "/resources/case-studies", label: "Boardroom breach case studies" },
      { href: "/resources/iam-policy-vs-service-control-policy-scp-what-s-the-difference", label: "IAM policy vs Service Control Policy" },
      { href: "/resources/how-do-s3-block-public-access-iam-policies-and-bucket-policies-relate", label: "S3 Block Public Access, IAM & bucket policies" },
      { href: "/resources/downloads", label: "Well-Architected Framework guide (free download)" },
    ],
  },
  {
    id: "offensive-security",
    title: "Offensive Security (Ethical Hacking & Penetration Testing)",
    tagline: "The red-team route: find the holes before someone hostile does, with permission and a report.",
    whyItFits:
      "You think adversarially and you thrive when the day is open-ended. Ethical hacking channels exactly that: authorized, methodical attacks on real systems, finished with a professional report that makes the defense stronger. It rewards curiosity, patience, and the discipline to stay inside the rules of engagement.",
    salary: [
      { level: "Entry", usd: "$85,000", ngn: "₦2,100,000" },
      { level: "Mid", usd: "$152,000", ngn: "₦5,400,000" },
      { level: "Senior / Lead", usd: "$195,000", ngn: "₦9,000,000" },
    ],
    roadmap: [
      { step: "Networking & security fundamentals", body: "You can't break what you don't understand: protocols, auth, and where trust lives." },
      { step: "Hands-on labs & CTFs", body: "Legal practice environments: capture-the-flag paths, vulnerable-by-design labs." },
      { step: "Web & cloud attack techniques", body: "The common classes of weakness, practiced only in authorized environments." },
      { step: "Professional pentesting", body: "Scoping, rules of engagement, and reports that get findings fixed." },
    ],
    certifications: ["CompTIA Security+", "OSCP (later, with experience)"],
    firstProject:
      "Complete a beginner path on a legal capture-the-flag platform and write a professional-style findings report for one machine, impact, evidence, and remediation.",
    resources: [
      { href: "/resources/iam-vs-security-groups-what-s-the-difference", label: "IAM vs security groups" },
      { href: "/resources/if-security-groups-are-stateful-why-do-they-have-outbound-rules", label: "Why stateful security groups have outbound rules" },
      { href: "/resources/case-studies", label: "Breach case studies (how attacks actually land)" },
      { href: "/resources/which-skills-actually-move-a-cloud-newbie-forward", label: "Which skills actually move a newbie forward" },
    ],
  },
];

/** The four temperament families behind the 16-type code. */
export const temperamentFamilies: Record<string, { name: string; blurb: string }> = {
  SJ: {
    name: "Guardian",
    blurb: "Steady, standards-driven, strongest where structure and reliability matter.",
  },
  SP: {
    name: "Responder",
    blurb: "Adaptive and hands-on, strongest where the situation changes faster than the plan.",
  },
  NT: {
    name: "Strategist",
    blurb: "Systems-minded and analytical, strongest where the problem is the architecture itself.",
  },
  NF: {
    name: "Advocate",
    blurb: "People-centred and meaning-driven, strongest where technology has to serve humans.",
  },
};

export type Temperament = {
  /** Four-letter code, e.g. "ISTJ". */
  code: string;
  family: { name: string; blurb: string };
};

/** Derive the 4-letter code + family from a full answer set. */
export function temperamentOf(answerIdx: number[]): Temperament | null {
  const letters: string[] = [];
  answerIdx.forEach((optIdx, qIdx) => {
    const l = questions[qIdx]?.options[optIdx]?.letter;
    if (l) letters.push(l);
  });
  if (letters.length !== 4) return null;
  const code = letters.join("");
  const familyKey =
    code.includes("S") && code.includes("J")
      ? "SJ"
      : code.includes("S")
        ? "SP"
        : code.includes("T")
          ? "NT"
          : "NF";
  return { code, family: temperamentFamilies[familyKey] };
}

/** Index of the timeline question (drives the pacing note). */
export const timelineIndex = questions.findIndex((q) => q.id === "timeline");

/**
 * Education-only caveat shown with every result, per the site's standing
 * policy on guidance content.
 */
export const resultDisclaimer =
  "These results are for education only and are not expert, professional, or career advice. This short assessment, including its temperament reading, cannot capture everything that a real career decision needs: personal introspection, your own interests and circumstances, and honest analysis over time. Treat the result as a starting point for your own research, not a verdict.";

/** Score a full answer set (option index per question) and return the winning track. */
export function scoreAnswers(answerIdx: number[]): Track {
  const totals = new Map<TrackId, number>(tracks.map((t) => [t.id, 0]));
  answerIdx.forEach((optIdx, qIdx) => {
    const opt = questions[qIdx]?.options[optIdx];
    if (!opt) return;
    for (const [id, w] of Object.entries(opt.weights)) {
      totals.set(id as TrackId, (totals.get(id as TrackId) ?? 0) + (w ?? 0));
    }
  });
  let best = tracks[0];
  let bestScore = -1;
  for (const t of tracks) {
    const s = totals.get(t.id) ?? 0;
    if (s > bestScore) {
      best = t;
      bestScore = s;
    }
  }
  return best;
}

export function trackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}
