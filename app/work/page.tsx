import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import LogoMarquee from "@/components/LogoMarquee";
import DiagramGallery from "@/components/DiagramGallery";
import TierTabs from "@/components/TierTabs";
import { diagrams, tiers, toolkitNote, workClose } from "@/lib/content";
import { pageBanners } from "@/lib/site";

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
        kicker="The work"
        title="Systems for the business, not just the stack."
        intro={
          <p>
            Systems built for businesses: cloud architecture for business
            decisions, security matched to real risk, and delivery at the speed
            the business needs. Every system below started as a decision, not
            just a technical one.
          </p>
        }
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#architecture">See the architecture</Button>
          <Button href="/advisory" variant="accent">
            The advisory view
          </Button>
        </div>
      </PageBanner>

      {/* ── The two tiers as side-by-side tabs. Both headings stay on screen,
          only the selected tier's cards render, which keeps this page short. */}
      <section className="relative isolate overflow-hidden py-10 sm:py-14">
        <div className="container-content">
          <TierTabs tiers={tiers} />
        </div>
      </section>

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
                Regulatory obligations translated into defaults engineers can
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
