import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import FlipCard from "@/components/FlipCard";
import FlipTile from "@/components/FlipTile";
import Converge from "@/components/Converge";
import LogoMarquee from "@/components/LogoMarquee";
import DiagramGallery from "@/components/DiagramGallery";
import TierBackdrop from "@/components/TierBackdrop";
import { diagrams, tiers, toolkitNote, workClose } from "@/lib/content";
import { pageBanners } from "@/lib/site";

/** Corner each grid tile converges from, in 2×2 order. */
const corners = ["tl", "tr", "bl", "br"] as const;

export const metadata: Metadata = {
  title: "Work",
  description:
    "Outcome-led, building-first. Cloud architecture that serves the P&L, security matched to real risk, delivery at the speed the business needs.",
};

export default function WorkPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.work}
        kicker="What I build"
        title="Systems for the business, not just the stack."
        intro={
          <p>
            I build systems for businesses, cloud architecture that serves the P&amp;L,
            security matched to real risk, and delivery at the speed the business needs.
            Every system below started as a business decision, not just a technical one.
          </p>
        }
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#architecture">See the architecture</Button>
          <Button href="/advisory" variant="accent">
            Work with me
          </Button>
        </div>
      </PageBanner>

      {/* ── Tiers, each heading flips to its detail; the 2×2 grid converges in.
          A subtle parallax backdrop fades in per tier to underline its message. */}
      {tiers.map((tier, ti) => {
        const hero = tier.items.find((i) => i.hero);
        const feature = tier.items.find((i) => i.feature);
        const grid = tier.items.filter((i) => !i.hero && !i.feature);

        return (
          <section
            key={tier.kicker}
            className="relative isolate overflow-hidden py-12 sm:py-20"
          >
            <TierBackdrop src={tier.backdrop} align={ti % 2 === 0 ? "right" : "left"} />
            <div className="container-content">
            <Reveal>
              <h2 className="font-serif text-h1 font-light text-signature">
                {tier.name}
              </h2>
              <p className="mt-3 max-w-2xl text-body text-ink">{tier.tagline}</p>
            </Reveal>

            {/* Lead item, big-number hero card, or a full-width feature tile. */}
            {hero && (
              <Reveal className="mt-10">
                <FlipCard
                  metric={hero.metric ?? ""}
                  metricLabel={hero.metricLabel ?? ""}
                  title={hero.title}
                  body={hero.body}
                  hero
                />
              </Reveal>
            )}
            {feature && (
              <Reveal className="mt-10">
                <FlipTile title={feature.title} body={feature.body} />
              </Reveal>
            )}

            {/* The rest, flip tiles converging from their corners, staggered. */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {grid.map((item, i) => (
                <Converge
                  key={item.title}
                  from={corners[i % corners.length]}
                  delay={i * 120}
                >
                  <FlipTile title={item.title} body={item.body} />
                </Converge>
              ))}
            </div>

            {/* Capabilities, a chip cloud; each pill fades up in sequence. */}
            <div className="mt-10">
              <Reveal>
                <p className="kicker text-blue-lift">Also in the kit</p>
              </Reveal>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {tier.capabilities
                  .split("·")
                  .map((c) => c.trim().replace(/\.$/, ""))
                  .filter(Boolean)
                  .map((cap, i) => (
                    <Reveal as="li" key={cap} delay={i * 90}>
                      <span className="inline-block rounded-full bg-signature px-4 py-2 text-small text-paper transition-colors duration-300 ease-calm hover:bg-blue-lift">
                        {cap}
                      </span>
                    </Reveal>
                  ))}
              </ul>
            </div>
            </div>
          </section>
        );
      })}

      {/* ── Architecture diagrams, a dark Signature band so the work pops off
          the Paper. An in-place gallery; click any one to view it larger. */}
      <section
        id="architecture"
        className="scroll-mt-20 bg-ink py-16 sm:py-24"
      >
        <div className="container-content">
          <Reveal>
            <p className="kicker text-amber">Selected architecture</p>
            <h2 className="mt-5 max-w-2xl font-serif text-h1 font-light text-paper">
              The diagrams behind the decisions.
            </h2>
            <p className="mt-4 max-w-prose text-body text-paper/70">
              A rolling look at designed architecture, real systems, drawn end to
              end. They switch on their own; click any one to view it larger.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-amber/30 bg-paper p-4 shadow-2xl shadow-ink/40 sm:p-6">
              <DiagramGallery diagrams={diagrams} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The toolkit, note + a continuously rolling logo marquee. */}
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
              {workClose}
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
