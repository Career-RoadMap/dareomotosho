import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import BioLengths from "@/components/BioLengths";
import { bioCloseText, bioPersonal, bioRoles, bioStory, bios } from "@/lib/content";
import { aboutPortrait, brand, pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "I work at the seam between engineering and the business — building business-aligned systems, and growing the people who'll stand in both rooms.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.about}
        kicker="About"
        title="I work at the seam between engineering and the business."
        intro={
          <p>
            Two rooms rarely speak the same language: the technical floor and the
            boardroom. I've spent my career in the doorway between them — building
            business-aligned systems, and translating each room to the other.
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
            <span className="kicker absolute left-5 top-5 text-amber">Dare Omotosho</span>
          </div>
        }
      />

      {/* ── The bridge — the brand line in full, given room to breathe. */}
      <section className="container-content pt-12 pb-12 sm:pt-16 sm:pb-16">
        <Reveal>
          <span className="block h-px w-16 bg-amber" aria-hidden />
          <p className="mt-8 max-w-3xl font-serif text-h1 font-light leading-snug text-ink">
            {brand.oneLine}
          </p>
        </Reveal>
      </section>

      {/* ── The story — the bio narrative, set in a box. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-paper p-8 sm:p-12">
            <div className="space-y-6">
              {bioStory.map((para, i) => (
                <p key={i} className="text-body text-ink">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
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

      {/* ── Closing — the three roles set apart, then the statement. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-serif text-h1 font-light leading-none text-signature">
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
            <p className="mx-auto mt-8 max-w-2xl text-body text-ink">{bioCloseText}</p>
          </div>
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
