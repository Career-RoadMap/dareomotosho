import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import PageBanner from "@/components/PageBanner";
import EmailCapture from "@/components/EmailCapture";
import LatestVideo from "@/components/LatestVideo";
import { seedEntries } from "@/lib/library";
import { pageBanners, brand, social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Business-aligned cloud engineering",
  description:
    "Business-aligned cloud engineering: architecture, security, and delivery built around the business decision inside every system, not just the tooling.",
};

const doors = [
  {
    href: "/start-here",
    label: "Start Learning",
    body: "Cloud powers the modern internet, and it's learnable from zero. An ordered path that turns the fundamentals into real, job-ready skill.",
  },
  {
    href: "/work",
    label: "Engineers & Teams",
    body: "Systems built for the business, and the judgment behind them.",
  },
  {
    href: "/speaking",
    label: "Speaking engagements",
    body: "Opinions worth booking, and advisory at the decision table.",
  },
];

export default function HomePage() {
  const latestResource = seedEntries[0];

  return (
    <>
      {/* ── HERO BANNER, full-viewport, landing-style. Placeholder banner art
          sits behind the headline; all key content lands above the fold. */}
      <PageBanner
        image={pageBanners.home}
        title={
          <>
            The tool <span className="text-amber">is the easy part.</span> The{" "}
            <span className="text-amber">judgment</span> is the job.
          </>
        }
        intro={<p>{brand.oneLine}</p>}
      >
        <Button href="/work">See what I build</Button>
      </PageBanner>

      {/* ── Three audience doors, gentle staggered fade-in on scroll. */}
      <section className="container-content py-16 sm:py-20">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {doors.map((door, i) => (
            <Reveal as="li" key={door.href} delay={i * 120}>
              <Link
                href={door.href}
                className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60 sm:p-10"
              >
                <span className="font-serif text-h2 font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                  {door.label}
                </span>
                <span className="mt-4 text-body text-ink">{door.body}</span>
                <span className="mt-8 inline-flex items-center gap-2 text-small text-link">
                  Enter
                  <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── POV line, quiet feature, lots of air. */}
      <section className="container-content py-24 sm:py-32">
        <Reveal>
          <p className="kicker text-center text-blue-lift">
            Business-aligned cloud engineering
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-center font-serif text-h2 font-light leading-snug text-ink">
            Most engineers optimize the tool. But business-aligned cloud
            engineering means treating every system as{" "}
            <span className="text-signature">the business decision it already is.</span>
          </h2>
        </Reveal>
      </section>

      {/* ── Latest strip, newest resource · latest video. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">The latest</h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2">
          <Reveal as="div" className="bg-paper p-8">
            <p className="kicker text-blue-lift">Newest resource</p>
            <h3 className="mt-5 font-serif text-h2 font-light text-ink">
              {latestResource.title}
            </h3>
            <p className="mt-4 text-small text-ink">{latestResource.summary}</p>
            <Link
              href={`/resources/${latestResource.slug}`}
              className="link-quiet mt-6 inline-block text-small"
            >
              Open resource
            </Link>
          </Reveal>

          <Reveal as="div" delay={120} className="bg-paper p-8">
            <p className="kicker text-blue-lift">Latest video</p>
            <div className="mt-5">
              <LatestVideo />
            </div>
            <a
              href={social.youtube}
              target="_blank"
              rel="noreferrer"
              className="link-quiet mt-6 inline-block text-small"
            >
              Visit the channel
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── Email capture, prominent, repeated. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal className="flex flex-col items-start gap-4">
          <EmailCapture />
        </Reveal>
      </section>
    </>
  );
}
