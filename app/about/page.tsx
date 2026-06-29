import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import BioLengths from "@/components/BioLengths";
import { bios } from "@/lib/content";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The bridge identity, the thesis, and the leadership philosophy behind the work.",
};

const philosophy = [
  {
    title: "Autonomy",
    body: "People do their best work when they own the outcome. I set the why and the edges, then get out of the way.",
  },
  {
    title: "Collaboration",
    body: "The best systems are argued into existence by people who trust each other enough to disagree well.",
  },
  {
    title: "Communication",
    body: "Clarity is a kindness and a force multiplier. If it can't be said plainly, it isn't understood yet.",
  },
];

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
            boardroom. I've spent my career standing in the doorway between them —
            building the systems that connect them, and translating each to the other.
          </p>
        }
      />

      {/* ── The bridge — the brand line in full, paired with a professional
          portrait placeholder (warm treatment; swap for a real photo). The
          thin amber frame is the photo's warmth (G2.5), no fill. */}
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

      {/* ── The thesis. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <p className="kicker text-amber">The thesis</p>
          <p className="mt-6 max-w-3xl font-serif text-h1 font-light leading-tight text-ink">
            The tool was never the hard part. The judgment is — knowing which system to
            build, and why, given the business you're in.
          </p>
          <p className="mt-8 max-w-2xl text-body text-ink">
            Most engineers are taught to optimize the tool. Almost none are taught that
            every system they build is a business decision in disguise. Closing that gap
            — in myself, in teams, in newcomers — is the whole of the work.
          </p>
        </Reveal>
      </section>

      {/* ── Leadership philosophy. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">
            How I lead
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {philosophy.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <h3 className="font-serif text-h2 font-light text-signature">{p.title}</h3>
              <p className="mt-4 text-body text-ink">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Mentorship thread. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <div className="rounded-3xl border border-ink/10 bg-paper p-10 sm:p-16">
            <p className="kicker text-amber">The mentorship thread</p>
            <p className="mt-6 max-w-3xl font-serif text-h2 font-light leading-snug text-ink">
              The people I work with should leave better than the project found them.
            </p>
            <p className="mt-6 max-w-2xl text-body text-ink">
              Mentorship runs through everything — the classes, the advisory, the daily
              work. Raising judgment, not just shipping output, is the part I'm proudest
              of and the part that outlasts any one system.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Bio in three lengths. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">The bio</h2>
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
