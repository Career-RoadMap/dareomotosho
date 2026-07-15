import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import CollectionCard from "@/components/CollectionCard";
import { entryTypeMeta } from "@/lib/library";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn cloud engineering and cybersecurity with business thinking",
  description:
    "Learn cloud engineering and cybersecurity, and the business thinking behind both: an ordered, guided route with the latest resources, not a dump of links.",
};

const learningOrder = [
  {
    step: "01",
    title: "Get your bearings",
    body: "What the cloud actually is, in plain language, and the handful of ideas everything else rests on.",
  },
  {
    step: "02",
    title: "Build something small",
    body: "Stand up one real thing end to end. Confidence comes from shipping, not from reading.",
  },
  {
    step: "03",
    title: "Learn to read the bill",
    body: "Cost is a design input, not an afterthought. See where the money goes before habits set.",
  },
  {
    step: "04",
    title: "Think in risk",
    body: "Security sized to what you actually face. Start matching controls to real threats early.",
  },
  {
    step: "05",
    title: "Connect it to the business",
    body: "The step almost no one teaches: every system you build is a decision the business is making.",
  },
];

const whyExplainers = [
  {
    title: "Why cost",
    body: "Because the bill is where engineering meets the business most directly, and where good judgment shows up first.",
  },
  {
    title: "Why security",
    body: "Because trust is the product. Right-sized security protects it without grinding delivery to a halt.",
  },
  {
    title: "Why business-thinking",
    body: "Because the engineers who rise are the ones who can say what a system is for, in the language leaders use.",
  },
];

export default function StartHerePage() {
  return (
    <>
      <PageBanner
        image={pageBanners.learn}
        kicker="New to cloud"
        title="Start at the beginning."
        intro={
          <p>
            This is how you learn cloud engineering and cybersecurity with
            business thinking built in from day one: not a pile of links.
            We'll go step by step, the latest resources are yours, and you
            don't need a background to begin. You need a direction.
          </p>
        }
      >
        <Button href="/resources">Browse the library</Button>
      </PageBanner>

      {/* ── Guided learning order. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">
            Learn cloud engineering and cybersecurity, and how to think like
            the business
          </h2>
        </Reveal>
        <ol className="mt-10 space-y-4">
          {learningOrder.map((item, i) => (
            <Reveal as="li" key={item.step} delay={i * 90}>
              <div className="flex gap-6 rounded-2xl border border-ink/10 bg-paper p-7 sm:gap-10 sm:p-9">
                <span className="font-serif text-h1 font-light leading-none text-amber">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-serif text-h2 font-light text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Path Finder, the personalized way in, on the boldest band the
          palette allows so it can't be scrolled past. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl bg-amber p-8 shadow-xl shadow-ink/15 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <p className="kicker !text-ink/70">Not sure which direction?</p>
              <h2 className="mt-3 font-serif text-h2 font-medium text-ink">
                Take the three-minute Path Finder
              </h2>
              <p className="mt-3 max-w-prose text-body text-ink/85">
                Eight quick questions, temperament included, turn where you
                are into an ordered route: the role that fits you, what it
                pays, and exactly what to read first.
              </p>
            </div>
            <Button href="/path-finder" variant="primary" className="shrink-0">
              Find my path
            </Button>
          </div>
        </Reveal>
      </section>

      {/* ── Straight into the library: the strongest call to action on the
          page, set on its own amber-edged band so it can't be missed. */}
      <section className="container-content py-16 sm:py-20">
        <Reveal>
          <div className="rounded-3xl border-2 border-amber bg-paper p-8 shadow-lg shadow-ink/10 sm:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker text-amber">Free, no email wall</p>
                <h2 className="mt-3 font-serif text-h1 font-light text-signature">
                  Go straight to the library
                </h2>
                <p className="mt-3 max-w-prose text-body text-ink">
                  Three ways in. Take what's useful.
                </p>
              </div>
              <Button href="/resources" variant="accent" className="shrink-0">
                Open the library
              </Button>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              <CollectionCard
                href="/resources/articles"
                kind="article"
                label={entryTypeMeta.article.label}
                blurb={entryTypeMeta.article.blurb}
              />
              <CollectionCard
                href="/resources/case-studies"
                kind="case_study"
                label={entryTypeMeta.case_study.label}
                blurb={entryTypeMeta.case_study.blurb}
              />
              <CollectionCard
                href="/resources/downloads"
                kind="download"
                label="Downloads"
                blurb="Textbooks, slide decks, and short video clips, free to download."
              />
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ── Salary explorer, a quiet pointer to the standalone reference tool. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="kicker text-amber">Also worth a look</p>
              <h3 className="mt-3 font-serif text-h2 font-light text-paper">
                See what these roles tend to pay
              </h3>
              <p className="mt-3 max-w-prose text-body text-paper/70">
                A reference tool covering salary ranges and growth trends across
                30 cloud, security, and business roles, in USD or Naira.
              </p>
            </div>
            <a
              href="/tools/career-salary-explorer.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
            >
              Explore salary ranges
            </a>
          </div>
          {/* One line on desktop; wraps (never clips) on smaller screens. */}
          <p className="mt-4 text-xs text-ink/50 lg:whitespace-nowrap">
            Educational reference only, not professional, career, or financial
            advice or a recommendation. Actual pay varies by company, location,
            and experience.
          </p>
        </Reveal>
      </section>

      {/* ── Why explainers, boxed, easing up in sequence. */}
      <section className="container-content py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {whyExplainers.map((w, i) => (
            <Reveal key={w.title} delay={i * 140}>
              <div className="group h-full rounded-2xl bg-signature p-8 shadow-md shadow-ink/10 transition-all duration-300 ease-calm hover:-translate-y-1 hover:bg-blue-lift hover:shadow-lg hover:shadow-ink/20 sm:p-10">
                {/* The amber accents read left → centre → right across the row. */}
                <span
                  className={`block h-1 w-10 rounded-full bg-amber transition-all duration-300 ease-calm group-hover:w-16 ${
                    i === 1 ? "mx-auto" : i === 2 ? "ml-auto" : ""
                  }`}
                  aria-hidden
                />
                <h3 className="mt-6 font-serif text-h2 font-light text-amber">
                  {w.title}
                </h3>
                <p className="mt-4 text-body text-paper/85">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AI-era reassurance. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal>
          <div className="rounded-3xl border border-amber/40 bg-paper p-10 sm:p-16">
            <p className="kicker text-amber">In the age of AI</p>
            <p className="mt-6 max-w-3xl font-serif text-h1 font-light leading-tight text-ink">
              AI is very good at the tool. It's far weaker at the judgment.
            </p>
            <p className="mt-6 max-w-2xl text-body text-ink">
              Knowing which system to build, and why, given the business you're in,
              that's the part worth learning, and the part that lasts. Start there and
              you start ahead.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── CTA → the library. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-ink">
            The best first step is the starter path.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-ink">
            Come with questions. Leave with a direction.
          </p>
          <div className="mt-10">
            <Button href="/resources" variant="accent">
              Browse the library
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
