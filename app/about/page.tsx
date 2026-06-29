import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import BioLengths from "@/components/BioLengths";
import { bioClose, bioPersonal, bioStory, bios } from "@/lib/content";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "I work at the seam between engineering and the business — building business-aligned systems, and growing the people who'll stand in both rooms.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        tone="warm"
        title="I work at the seam between engineering and the business."
        intro={
          <p>
            Two rooms rarely speak the same language: the technical floor and the
            boardroom. I've spent my career in the doorway between them — building
            business-aligned systems, and translating each room to the other.
          </p>
        }
      />

      {/* ── The bridge — the brand line in full, paired with a professional
          portrait placeholder (warm treatment; swap for a real photo). */}
      <section className="container-content pt-2 pb-12 sm:pt-4 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <Reveal>
            <span className="block h-px w-16 bg-amber" aria-hidden />
            <p className="mt-8 max-w-2xl font-serif text-h2 font-light leading-snug text-ink">
              {brand.oneLine}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-amber/40 bg-paper">
              <div className="aspect-[4/5] w-full" />
              <span className="kicker absolute left-6 top-6 text-amber">Photo</span>
              <p className="absolute bottom-6 left-6 text-small text-ink/45">
                Professional photo mounts here.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The story — the bio narrative, paragraph by paragraph. */}
      <section className="container-content py-12 sm:py-16">
        <div className="max-w-prose space-y-6">
          {bioStory.map((para, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="text-body text-ink">{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Off the cloud — a warm, human aside. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="rounded-3xl border border-amber/40 bg-paper p-8 sm:p-12">
            <p className="kicker text-amber">Off the cloud</p>
            <p className="mt-5 max-w-2xl font-serif text-h2 font-light leading-snug text-ink">
              {bioPersonal}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Closing statement. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-serif text-h1 font-light leading-tight text-signature">
            {bioClose}
          </p>
        </Reveal>
      </section>

      {/* ── Bio in three lengths. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">Grab a bio</h2>
          <p className="mt-3 text-small text-ink/60">
            Take whichever length you need — for an intro, a profile, or the press kit.
          </p>
          <div className="mt-8">
            <BioLengths bios={bios} />
          </div>
        </Reveal>
      </section>

      {/* ── CTA. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-ink">
            If any of this resonates, let's talk.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/advisory" variant="accent">
              Work with me
            </Button>
            <Button href="/start-here" variant="ghost">
              Just getting started
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
