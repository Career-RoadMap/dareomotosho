import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "New to cloud? Start at the beginning, in order — a guided route with free starter resources, not a dump of links.",
};

const learningOrder = [
  {
    step: "01",
    title: "Get your bearings",
    body: "What the cloud actually is, in plain language — and the handful of ideas everything else rests on.",
  },
  {
    step: "02",
    title: "Build something small",
    body: "Stand up one real thing end to end. Confidence comes from shipping, not from reading.",
  },
  {
    step: "03",
    title: "Learn to read the bill",
    body: "Cost is a design input, not an afterthought. See where the money goes before habits set.",
  },
  {
    step: "04",
    title: "Think in risk",
    body: "Security sized to what you actually face. Start matching controls to real threats early.",
  },
  {
    step: "05",
    title: "Connect it to the business",
    body: "The step almost no one teaches: every system you build is a decision the business is making.",
  },
];

const whyExplainers = [
  {
    title: "Why cost",
    body: "Because the bill is where engineering meets the business most directly — and where good judgment shows up first.",
  },
  {
    title: "Why security",
    body: "Because trust is the product. Right-sized security protects it without grinding delivery to a halt.",
  },
  {
    title: "Why business-thinking",
    body: "Because the engineers who rise are the ones who can say what a system is for, in the language leaders use.",
  },
];

export default function StartHerePage() {
  const starters = resources.filter((r) => r.level === "Newcomer").slice(0, 3);
  const starterPool =
    starters.length > 0 ? starters : resources.slice(0, 3);

  return (
    <>
      <PageHero
        kicker="New to cloud"
        tone="warm"
        title="Start at the beginning. In order."
        intro={
          <p>
            Not a pile of links — a route. We'll go step by step, the free starter
            resources are yours, and you don't need a background to begin. You need a
            direction.
          </p>
        }
      />

      {/* ── Guided learning order. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">The path</h2>
        </Reveal>
        <ol className="mt-10 space-y-4">
          {learningOrder.map((item, i) => (
            <Reveal as="li" key={item.step} delay={i * 90}>
              <div className="flex gap-6 rounded-2xl border border-ink/10 bg-paper p-7 sm:gap-10 sm:p-9">
                <span className="font-serif text-h1 font-light leading-none text-amber">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-serif text-h2 font-light text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Free starter resources. */}
      <section className="container-content py-16 sm:py-20">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">Free to start</h2>
          <p className="mt-3 max-w-prose text-body text-ink">
            Downloads to keep, no email wall. Take what's useful.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {starterPool.map((r, i) => (
            <Reveal as="div" key={r.slug} delay={i * 100} className="bg-paper p-8">
              <p className="kicker text-blue-lift">{r.type}</p>
              <h3 className="mt-4 font-serif text-xl font-medium text-ink">{r.title}</h3>
              <p className="mt-3 text-small text-ink">{r.summary}</p>
              <a
                href={`/resources/${r.slug}`}
                className="link-quiet mt-6 inline-block text-small"
              >
                Open
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Why explainers. */}
      <section className="container-content py-16 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {whyExplainers.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <h3 className="font-serif text-h2 font-light text-signature">{w.title}</h3>
              <p className="mt-4 text-body text-ink">{w.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AI-era reassurance. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal>
          <div className="rounded-3xl border border-amber/40 bg-paper p-10 sm:p-16">
            <p className="kicker text-amber">In the age of AI</p>
            <p className="mt-6 max-w-3xl font-serif text-h1 font-light leading-tight text-ink">
              AI is very good at the tool. It's far weaker at the judgment.
            </p>
            <p className="mt-6 max-w-2xl text-body text-ink">
              Knowing which system to build, and why, given the business you're in —
              that's the part worth learning, and the part that lasts. Start there and
              you start ahead.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── CTA → the library. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-ink">
            The best first step is the starter path.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-ink">
            Come with questions. Leave with a direction.
          </p>
          <div className="mt-10">
            <Button href="/resources" variant="accent">
              Browse the library
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
