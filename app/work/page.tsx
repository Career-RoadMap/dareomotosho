import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import CountUp from "@/components/CountUp";
import { capabilities, outcomes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "I build systems for businesses — cloud architecture that serves the P&L, security matched to real risk, delivery at the speed the business needs.",
};

/** Split a metric into number + suffix for an optional dignified count-up. */
function parseMetric(metric: string): { num: number; suffix: string } | null {
  const match = metric.match(/^(\d+)(\D*)$/);
  if (!match) return null;
  return { num: Number(match[1]), suffix: match[2] };
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        kicker="What I build"
        tone="cool"
        title="Systems for the business, not just the stack."
        intro={
          <p>
            I build systems for businesses — cloud architecture that serves the P&amp;L,
            security matched to real risk, and delivery at the speed the business needs.
          </p>
        }
      />

      {/* ── Featured cases — outcome-led, one at a time, metric prominent. */}
      <section className="container-content py-12 sm:py-16">
        <div className="space-y-6">
          {outcomes.map((o) => {
            const parsed = parseMetric(o.metric);
            const hero = o.hero;
            return (
              <Reveal key={o.title}>
                <article
                  className={`grid gap-8 rounded-3xl p-8 sm:grid-cols-[minmax(0,0.9fr)_1.4fr] sm:p-12 lg:p-16 ${
                    hero
                      ? "bg-signature text-paper"
                      : "border border-ink/10 bg-paper text-ink"
                  }`}
                >
                  <div>
                    <p
                      className={`kicker ${hero ? "text-amber" : "text-blue-lift"}`}
                    >
                      {hero ? "Hero proof" : "Outcome"}
                    </p>
                    <p
                      className={`mt-5 font-serif font-light leading-none ${
                        hero ? "text-paper text-display" : "text-signature text-h1"
                      }`}
                    >
                      {parsed ? (
                        <CountUp value={parsed.num} suffix={parsed.suffix} />
                      ) : (
                        o.metric
                      )}
                    </p>
                    <p
                      className={`mt-4 text-small ${
                        hero ? "text-paper/65" : "text-ink/55"
                      }`}
                    >
                      {o.metricLabel}
                    </p>
                  </div>
                  <div className="sm:self-center">
                    <h2
                      className={`font-serif text-h2 font-light leading-tight ${
                        hero ? "text-paper" : "text-ink"
                      }`}
                    >
                      {o.title}
                    </h2>
                    <p
                      className={`mt-5 max-w-prose text-body ${
                        hero ? "text-paper/75" : "text-ink/70"
                      }`}
                    >
                      {o.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Capabilities strip — grouped, lighter. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-signature">
            How the work holds together
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal as="div" key={c.title} delay={i * 80} className="bg-paper p-8">
              <h3 className="font-serif text-xl font-medium text-ink">{c.title}</h3>
              <p className="mt-4 text-small text-ink/70">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Close CTA → Advisory / Contact. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <div className="rounded-3xl border border-ink/10 bg-paper p-10 text-center sm:p-16">
            <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-signature">
              If your systems should be serving the business better, let's talk.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/advisory">Explore advisory</Button>
              <Button href="/contact" variant="ghost">
                Get in touch
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
