import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { talkTopics, episodes, outcomes } from "@/lib/content";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "Talks on cloud engineering and security governance, for career starters and boardrooms alike, rooted in systems actually built.",
};

export default function SpeakingPage() {
  const proofCases = outcomes.slice(0, 3);

  return (
    <>
      <PageBanner
        image={pageBanners.speaking}
        kicker="Speaking"
        title="Talks rooted in systems actually built."
        intro={
          <p>
            One opinion runs through every talk on cloud engineering and
            security governance, whether the room is career starters or a
            boardroom of solutions architects: every system an engineer builds
            is a business decision in disguise, and the industry trains almost
            no one to see it. That is the talk under all the talks.
          </p>
        }
      >
        <Button href="#topics" variant="accent">The talks</Button>
      </PageBanner>

      {/* ── The talks themselves, one at a time. */}
      <section id="topics" className="band scroll-mt-20">
        <div className="container-content py-10 sm:py-12">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-signature">
              Talks on cloud engineering and security governance, for career
              starters and boardrooms alike
            </h2>
            <p className="mt-3 max-w-prose text-body text-ink/70">
              Speaking from the floor, not just the stage.
            </p>
          </Reveal>
          <div className="mt-7 space-y-4">
            {talkTopics.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <article className="card-accent rounded-2xl border border-ink/[0.14] bg-paper p-7 sm:p-9">
                  <p className="kicker text-blue-lift">{t.audience}</p>
                  <h3 className="mt-4 font-serif text-h2 font-light text-ink">
                    {t.title}
                  </h3>
                  <p className="mt-4 max-w-prose text-body text-ink">{t.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof, built work + podcast + decks. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="rounded-3xl bg-signature p-10 text-paper sm:p-16">
            <p className="kicker text-amber">The proof</p>
            <h2 className="mt-6 max-w-2xl font-serif text-h1 font-light text-paper">
              Opinions earned in the build, not the abstract.
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {proofCases.map((c) => (
                <div key={c.title}>
                  <p className="font-serif text-h1 font-light leading-none text-paper">
                    {c.metric}
                  </p>
                  <p className="mt-3 text-small text-paper/70">{c.metricLabel}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-body text-paper/70">
              Plus {episodes.length}+ podcast conversations and designed decks. The
              material is current and lived, and all of it is open to read.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Closes on the material rather than a booking form: this page is a
          record of the talks and the thinking behind them. */}
      <section className="band-warm">
        <div className="container-content py-10 sm:py-12">
          <Reveal className="text-center">
            <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-signature">
              The same thinking, written down.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body text-ink">
              Every talk above comes out of a system that was actually built.
              The case studies and the episode kits carry the same reasoning in
              full.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/resources/case-studies" variant="accent">
                Read the case studies
              </Button>
              <Button href="/resources/field-kit" variant="ghost">
                Open The Field Kit
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
