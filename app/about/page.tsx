import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import BioLengths from "@/components/BioLengths";
import SectionDots from "@/components/SectionDots";
import { bioCloseText, bioPersonal, bioRoles, bioStory, bios } from "@/lib/content";
import { aboutPortrait, brand, pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Technical mentor, cloud engineer, cybersecurity engineer, solutions architect, and AI architect",
  description:
    "A technical mentor, cloud engineer, cybersecurity engineer, solutions architect, and AI architect working at the seam between engineering and the business, building business-aligned systems and growing the people who'll stand in both rooms.",
};

/** The "pages" of the About story, in reading order, mirrored by the dots. */
const sections = [
  { id: "seam", label: "The through-line" },
  { id: "story", label: "The story" },
  { id: "gap", label: "The gap I close" },
  { id: "human", label: "Off the cloud" },
  { id: "roles", label: "Three roles" },
  { id: "bios", label: "Grab a bio" },
  { id: "talk", label: "Let's talk" },
];

export default function AboutPage() {
  return (
    <>
      <SectionDots sections={sections} />

      {/* ── Page 0: who's talking. */}
      <PageBanner
        image={pageBanners.about}
        kicker="About"
        title="I work at the seam between engineering and the business."
        intro={
          <p>
            Two rooms rarely speak the same language: the technical floor and the
            boardroom. I've spent my career in the doorway between them, a
            technical mentor, cloud engineer, cybersecurity engineer, solutions
            architect, and AI architect building business-aligned systems, and
            translating each room to the other.
          </p>
        }
        figure={
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-amber/50 shadow-2xl shadow-ink/60 ring-1 ring-paper/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutPortrait}
              alt="Dare Omotosho"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        }
      />

      {/* ── Page 1: the through-line, one sentence, given a whole page. */}
      <section
        id="seam"
        className="flex min-h-[60vh] scroll-mt-20 items-center"
      >
        <div className="container-content py-16 sm:py-20">
          <Reveal>
            <p className="kicker text-blue-lift">The through-line</p>
            <span className="mt-6 block h-px w-16 bg-amber" aria-hidden />
            <p className="mt-8 max-w-3xl font-serif text-h1 font-light leading-snug text-ink">
              {brand.oneLine}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Page 2: the story, on a softly tinted band. */}
      <section
        id="story"
        className="flex min-h-[70vh] scroll-mt-20 items-center bg-ink/[0.04]"
      >
        <div className="container-content py-16 sm:py-24">
          <Reveal>
            <p className="kicker text-blue-lift">The story</p>
            <h2 className="mt-4 max-w-2xl font-serif text-h2 font-light text-signature">
              Technical mentor, cloud engineer, cybersecurity engineer,
              solutions architect, and AI architect
            </h2>
            <div className="mt-8 max-w-3xl space-y-6">
              {bioStory.map((para, i) => (
                <p key={i} className="text-body text-ink">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Page 3: the gap I close, the dark statement band. */}
      <section
        id="gap"
        className="flex min-h-[70vh] scroll-mt-20 items-center bg-ink"
      >
        <div className="container-content py-16 sm:py-24">
          <Reveal>
            <p className="kicker text-amber">The gap I close</p>
            <p className="mt-6 max-w-3xl font-serif text-h2 font-light leading-snug text-paper">
              Your controls get switched off under delivery pressure, and you
              find out at audit.
            </p>
            <p className="mt-6 max-w-2xl text-body text-paper/70">
              The problem isn't that your engineers are careless, it's that
              nobody has ever translated your regulatory obligations into
              something they can act on without it costing them the release. I
              close that gap, and I make it hold while the business keeps
              shipping.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Page 4: off the cloud, the human aside. */}
      <section
        id="human"
        className="flex min-h-[55vh] scroll-mt-20 items-center"
      >
        <div className="container-content py-16 sm:py-20">
          <Reveal>
            <p className="kicker text-amber">Off the cloud</p>
            <span className="mt-6 block h-px w-16 bg-amber" aria-hidden />
            <p className="mt-8 max-w-2xl font-serif text-h2 font-light leading-snug text-ink">
              {bioPersonal}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Page 5: the three roles, distilled, on the deep Signature band. */}
      <section
        id="roles"
        className="flex min-h-[60vh] scroll-mt-20 items-center bg-signature"
      >
        <div className="container-content py-16 sm:py-24">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-serif text-h1 font-light leading-none text-paper">
                {bioRoles.map((role, i) => (
                  <span key={role} className="inline-flex items-center gap-x-5">
                    {i > 0 ? (
                      <span className="text-amber" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    {role}
                  </span>
                ))}
              </div>
              <p className="mx-auto mt-8 max-w-2xl text-body text-paper/75">
                {bioCloseText}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Page 6: bios in three lengths. */}
      <section id="bios" className="scroll-mt-20">
        <div className="container-content py-16 sm:py-24">
          <Reveal>
            <p className="kicker text-blue-lift">For organisers & press</p>
            <h2 className="mt-4 font-serif text-h2 font-light text-ink">Grab a bio</h2>
            <p className="mt-3 text-small text-ink/60">
              Take whichever length you need, for an intro, a profile, or the press kit.
            </p>
            <div className="mt-8">
              <BioLengths bios={bios} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Page 7: the invitation. */}
      <section
        id="talk"
        className="flex min-h-[50vh] scroll-mt-20 items-center"
      >
        <div className="container-content py-16 sm:py-24">
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
        </div>
      </section>
    </>
  );
}
