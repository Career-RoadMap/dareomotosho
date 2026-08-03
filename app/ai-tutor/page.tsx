import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dharey, the AI tutor for AWS certification",
  description:
    "Dharey is a chat-based AWS certification coach that makes you reason instead of handing you answers. Socratic practice, mock exams, and graded scenarios for AIF-C01, SAA-C03, and CLF-C02.",
};

const TUTOR_URL = "https://dharey.com";

/** The three things that make the coach different from a question bank. */
const principles = [
  {
    kicker: "It withholds the answer",
    title: "You get questioned, not answered",
    body: "Ask whether to use EBS or EFS and the coach will not tell you. It asks what your access pattern is, whether more than one instance needs the volume, and what your durability requirement is. That is the Socratic method, and it is the single most important design decision in the product. It is uncomfortable at first, so the coach explains what it is doing and why.",
  },
  {
    kicker: "It measures coverage",
    title: "Accuracy over a sample of one is not readiness",
    body: "Getting a question right does not make you ready in that domain, it makes you accurate across one question. The progress figure multiplies how often you are right by how much of the domain you have actually touched, so a single correct answer moves the bar barely at all rather than declaring you competent.",
  },
  {
    kicker: "It follows the real weighting",
    title: "Time spent where the exam actually is",
    body: "AWS publishes the percentage of the exam each domain is worth. The coach weights its progress the same way, so an hour in a domain worth thirty percent of the paper counts for more than an hour in one worth twelve.",
  },
];

/** The modes a learner works in. */
const modes = [
  {
    icon: "📚",
    name: "Learn",
    what: "Socratic conversation. You bring a topic or a confusion, and the coach questions you toward the answer.",
    when: "Daily study, and working through a concept that has not clicked.",
  },
  {
    icon: "🎯",
    name: "Mock exam",
    what: "Sixty-five exam-standard multiple-choice questions, scored like the real thing, with a domain-by-domain breakdown at the end.",
    when: "Checking readiness, and finding the domains that are still weak.",
  },
  {
    icon: "📝",
    name: "Grade",
    what: "You write a free-text answer to a scenario, and the coach grades it across several dimensions and explains the gaps.",
    when: "Practising the reasoning the exam actually tests.",
  },
];

const exams = [
  { code: "AIF-C01", name: "AI Practitioner" },
  { code: "SAA-C03", name: "Solutions Architect Associate" },
  { code: "CLF-C02", name: "Cloud Practitioner" },
];

export default function AiTutorPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.learn}
        kicker="AI tutor"
        title="An AWS coach that makes you think."
        intro={
          <p>
            Most people prepare for an AWS certification by memorising question
            banks, then discover in the exam room that the real questions are
            scenarios, not recall. Dharey is a chat-based coach that refuses to
            just hand over the answer. It asks you questions, makes you reason,
            and only then confirms or corrects you.
          </p>
        }
      >
        <a
          href={TUTOR_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
        >
          Start with Dharey
          <span aria-hidden>→</span>
        </a>
      </PageBanner>

      {/* ── The problem the exam actually poses. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <p className="kicker text-blue-lift">Why question banks fail</p>
          <h2 className="mt-4 max-w-3xl font-serif text-h2 font-light text-signature">
            You can score 95% on a practice dump and still fail the exam.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card-accent h-full rounded-2xl border border-ink/[0.14] bg-paper p-7 sm:p-9">
              <h3 className="font-serif text-xl font-medium text-ink">
                What the paper actually asks
              </h3>
              <p className="mt-3 text-body text-ink">
                An AWS certification exam is scored out of 1000, and a pass is
                typically 700. The questions are not &ldquo;what does S3 stand
                for&rdquo;. They are three-paragraph business scenarios ending in
                which solution meets these requirements most cost effectively,
                with four plausible answers where two are technically correct
                and only one is correct for the stated constraints.
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="card-accent h-full rounded-2xl border border-ink/[0.14] bg-paper p-7 sm:p-9">
              <h3 className="font-serif text-xl font-medium text-ink">
                What a question bank trains
              </h3>
              <p className="mt-3 text-body text-ink">
                Dumps train pattern-matching on the exact wording of questions
                that will not appear. The learner ends up knowing the answer
                key rather than the judgment, which is why a high practice
                score and a failed exam sit together so often.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How the coach is built differently. */}
      <section className="band">
        <div className="container-content py-12 sm:py-16">
          <Reveal>
            <p className="kicker text-amber">How it works</p>
            <h2 className="mt-4 max-w-3xl font-serif text-h2 font-light text-signature">
              Three decisions that separate a coach from a quiz.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="card-accent rounded-2xl border border-ink/[0.14] bg-paper p-7 sm:p-9">
                  <p className="kicker text-blue-lift">{p.kicker}</p>
                  <h3 className="mt-3 font-serif text-h2 font-light text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The three working modes. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <p className="kicker text-blue-lift">The three modes</p>
          <h2 className="mt-4 max-w-3xl font-serif text-h2 font-light text-signature">
            Everything you do sits in one of three places.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/[0.14] bg-ink/[0.14] sm:grid-cols-3">
          {modes.map((m, i) => (
            <Reveal as="div" key={m.name} delay={i * 90} className="card-accent bg-paper p-7 sm:p-9">
              <span className="text-2xl" aria-hidden>
                {m.icon}
              </span>
              <h3 className="mt-3 font-serif text-h2 font-light text-signature">
                {m.name}
              </h3>
              <p className="mt-3 text-body text-ink">{m.what}</p>
              <p className="mt-4 text-small text-ink/70">
                <span className="font-medium text-signature">Use it for:</span>{" "}
                {m.when}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <div className="rounded-2xl border border-ink/[0.14] bg-paper p-7 sm:p-9">
            <p className="kicker text-amber">And one quieter mode</p>
            <p className="mt-3 max-w-prose text-body text-ink">
              <span aria-hidden>🩺</span>{" "}
              <span className="font-medium">Diagnostic</span> runs a short
              survey the first time you meet an exam, placing you at beginner,
              intermediate, or advanced. Every other mode then adjusts its
              difficulty and its explanations to that level.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Who it covers, and where the software stops. */}
      <section className="band">
        <div className="container-content py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <p className="kicker text-blue-lift">Certifications covered</p>
              <h2 className="mt-4 font-serif text-h2 font-light text-signature">
                Built for the exams people actually start with.
              </h2>
              <ul className="mt-6 space-y-3">
                {exams.map((e) => (
                  <li
                    key={e.code}
                    className="card-accent flex flex-wrap items-baseline gap-x-3 rounded-xl border border-ink/[0.14] bg-paper px-5 py-4"
                  >
                    <span className="font-serif text-lg font-medium text-signature">
                      {e.code}
                    </span>
                    <span className="text-body text-ink">{e.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={90}>
              <p className="kicker text-amber">When software is not enough</p>
              <h2 className="mt-4 font-serif text-h2 font-light text-signature">
                It knows when to hand you to a human.
              </h2>
              <p className="mt-6 max-w-prose text-body text-ink">
                Some blockers are not solvable by a chatbot. When you hit one,
                the coach offers a route to a human mentor rather than looping
                you through another explanation that is not landing.
              </p>
              <p className="mt-4 max-w-prose text-small text-ink/70">
                Dharey is an independent study tool. It is not affiliated with,
                endorsed by, or an official product of Amazon Web Services, and
                it prepares you for the exam rather than guaranteeing a result.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Close: go and use it. */}
      <section className="band-warm">
        <div className="container-content py-12 sm:py-16">
          <Reveal className="text-center">
            <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-ink">
              Prepare like the exam is a conversation.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body text-ink">
              Bring the topic that has not clicked yet, and let it ask you the
              first question.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={TUTOR_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
              >
                Open dharey.com
                <span aria-hidden>→</span>
              </a>
              <Button href="/start-here" variant="ghost">
                New to cloud entirely
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
