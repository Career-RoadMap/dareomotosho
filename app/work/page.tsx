import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import FlipCard from "@/components/FlipCard";
import LogoMarquee from "@/components/LogoMarquee";
import { capabilities, outcomes, toolkitNote } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "I build systems for businesses — cloud architecture that serves the P&L, security matched to real risk, and delivery pipelines that move at the speed the business needs.",
};

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
            security matched to real risk, and delivery pipelines that move at the speed
            the business needs. Every system below started as a business decision, not
            just a technical one.
          </p>
        }
      />

      {/* ── Featured cases — heading only; click each to flip and read the detail. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <p className="text-small text-ink/55">
            Each card shows the outcome —{" "}
            <span className="text-amber">click to flip</span> and read how it was built.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {outcomes.map((o) => (
            <Reveal key={o.title} className={o.hero ? "sm:col-span-2" : undefined}>
              <FlipCard
                metric={o.metric}
                metricLabel={o.metricLabel}
                title={o.title}
                body={o.body}
                hero={o.hero}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Capabilities strip — grouped, lighter. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-signature">
            How the work holds together
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal as="div" key={c.title} delay={i * 80} className="bg-paper p-8 sm:p-10">
              <h3 className="font-serif text-xl font-medium text-ink">{c.title}</h3>
              <p className="mt-4 text-small text-ink">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The toolkit — note + a continuously rolling logo marquee. */}
      <section className="py-12 sm:py-16">
        <div className="container-content">
          <Reveal>
            <p className="kicker text-amber">The toolkit</p>
            <p className="mt-5 max-w-2xl text-body text-ink">{toolkitNote}</p>
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <LogoMarquee />
        </Reveal>
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
