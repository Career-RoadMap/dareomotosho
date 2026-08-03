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
  title: "Cloud architecture for business decisions",
  description:
    "Cloud architecture for business decisions: outcome-led engineering that serves the P&L, security matched to real risk, and delivery at the speed the business needs.",
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
            I build systems for businesses: cloud architecture for business
            decisions, security matched to real risk, and delivery at the speed
            the business needs. Every system below started as a decision, not
            just a technical one.
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
            // Alternating surfaces so each tier reads as its own page on the
            // way down: even tiers on Paper, odd tiers on the tinted band.
            className={`relative isolate overflow-hidden py-10 sm:py-14 ${
              ti % 2 === 1 ? "band" : ""
            }`}
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
              <Reveal className="mt-7">
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
              <Reveal className="mt-7">
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
            <div className="mt-7">
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
        className="scroll-mt-20 bg-ink py-12 sm:py-16"
      >
        <div className="container-content">
          <Reveal>
            <p className="kicker text-amber">Selected architecture</p>
            <h2 className="mt-5 max-w-2xl font-serif text-h1 font-light text-paper">
              Cloud architecture behind the business decisions.
            </h2>
            <p className="mt-4 max-w-prose text-body text-paper/70">
              A rolling look at designed architecture, real systems, drawn end to
              end. They switch on their own; click any one to view it larger.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <div className="rounded-3xl border border-amber/30 bg-paper p-4 shadow-2xl shadow-ink/40 sm:p-6">
              <DiagramGallery diagrams={diagrams} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The toolkit, note + a continuously rolling logo marquee. */}
      <section className="band py-10 sm:py-12">
        <div className="container-content">
          <Reveal>
            <p className="kicker text-amber">The toolkit</p>
            <p className="mt-5 max-w-2xl text-body text-ink">{toolkitNote}</p>
          </Reveal>
        </div>
        <Reveal className="mt-8">
          <LogoMarquee />
        </Reveal>
      </section>

      {/* ── Compliance that survives delivery pressure, variant of the
          About-page statement, in Work's outcome-led register. Left on Paper:
          the toolkit band sits directly above, and the dark card carries its
          own contrast. */}
      <section>
        <div className="container-content py-10 sm:py-12">
          <Reveal>
            <div className="rounded-3xl bg-ink p-10 text-paper sm:p-16">
              <p className="kicker text-amber">Controls that hold</p>
              <p className="mt-6 max-w-3xl font-serif text-h2 font-light leading-snug text-paper">
                Controls that only hold until the next deadline aren't controls.
              </p>
              <p className="mt-6 max-w-2xl text-body text-paper/70">
                I translate regulatory obligations into defaults engineers can
                act on without it costing them the release, so the audit holds
                and the business keeps shipping.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Close CTA → Advisory / Contact. */}
      <section className="band-warm">
        <div className="container-content py-12 sm:py-16">
          <Reveal>
            <div className="rounded-3xl border border-ink/[0.14] bg-paper p-10 text-center sm:p-16">
              <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-signature">
                {workClose}
              </h2>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Button href="/advisory">Explore advisory</Button>
                <Button href="/contact" variant="ghost">
                  Get in touch
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
