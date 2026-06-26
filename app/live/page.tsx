import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EmailCapture from "@/components/EmailCapture";
import { episodes, schedule } from "@/lib/content";

export const metadata: Metadata = {
  title: "Live",
  description:
    "Weekly live classes by level, plus the podcast and a replay archive.",
};

export default function LivePage() {
  return (
    <>
      <PageHero
        kicker="Classes & podcast"
        tone="cool"
        title="Live, weekly, by level."
        intro={
          <p>
            Come with questions, leave with a direction. Sessions are sorted by level so
            you're always in the right room — and everything is recorded if you can't
            make it live.
          </p>
        }
      />

      {/* ── Weekly schedule + signup. */}
      <section className="container-content py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-serif text-h2 font-light text-ink">This week</h2>
            </Reveal>
            <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {schedule.map((s) => (
                <Reveal as="li" key={s.title}>
                  <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-small text-ink/55">{s.level}</p>
                    </div>
                    <p className="text-small text-ink/70">
                      {s.day} · {s.time} · {s.cadence}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Signup — seam for Supabase. */}
          <Reveal>
            <div className="rounded-2xl border border-ink/10 bg-paper p-8">
              <h2 className="font-serif text-h2 font-light text-ink">Save your seat</h2>
              <p className="mt-3 text-small text-ink/65">
                Reserve a spot and get joining details and replays.
              </p>
              <div className="mt-6">
                <EmailCapture
                  label="Reserve a seat"
                  hint="Class dates and the joining link, nothing else."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Podcast episodes. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">The podcast</h2>
          <p className="mt-3 max-w-prose text-body text-ink/70">
            Conversations at the seam of engineering and the business — each with a
            designed deck.
          </p>
        </Reveal>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {episodes.map((ep, i) => (
            <Reveal as="li" key={ep.title} delay={i * 90} className="bg-paper p-8">
              <p className="kicker text-blue-lift">
                {new Date(ep.published).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <h3 className="mt-4 font-serif text-xl font-medium text-ink">
                {ep.title}
              </h3>
              <p className="mt-2 text-small text-ink/55">{ep.guest}</p>
              <p className="mt-4 text-small text-ink/70">{ep.summary}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Replays archive — seam for recordings. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
            <h2 className="font-serif text-h2 font-light text-ink">Replays</h2>
            <p className="mt-3 max-w-prose text-small text-ink/65">
              The full recordings archive mounts here once wired to the video store.
              Every past class and episode, searchable by level.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
