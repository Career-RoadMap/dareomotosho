import Link from "next/link";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import PageBanner from "@/components/PageBanner";
import EmailCapture from "@/components/EmailCapture";
import { seedEntries } from "@/lib/library";
import { pageBanners, brand, social } from "@/lib/site";

const doors = [
  {
    href: "/start-here",
    label: "New to Cloud",
    body: "Start at the beginning, in order. A route, not a pile of links.",
  },
  {
    href: "/work",
    label: "Engineers & Teams",
    body: "Systems built for the business — and the judgment behind them.",
  },
  {
    href: "/speaking",
    label: "Leaders & Speaking",
    body: "Opinions worth booking, and advisory at the decision table.",
  },
];

export default function HomePage() {
  const latestResource = seedEntries[0];

  return (
    <>
      {/* ── HERO BANNER — full-viewport, landing-style. Placeholder banner art
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

      {/* ── Three audience doors — gentle staggered fade-in on scroll. */}
      <section className="container-content py-16 sm:py-20">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {doors.map((door, i) => (
            <Reveal as="li" key={door.href} delay={i * 120}>
              <Link
                href={door.href}
                className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60 sm:p-10"
              >
                <span className="kicker text-blue-lift">Door {i + 1}</span>
                <span className="mt-5 font-serif text-h2 font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
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

      {/* ── POV line — quiet feature, lots of air. */}
      <section className="container-content py-24 sm:py-32">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-serif text-h2 font-light leading-snug text-ink">
            Most engineers optimize the tool. But every system they build is a{" "}
            <span className="text-signature">business decision in disguise.</span>
          </p>
        </Reveal>
      </section>

      {/* ── Featured proof — the "40%". Slow fade as it lands. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <div className="rounded-3xl bg-signature px-8 py-16 text-paper sm:px-16 sm:py-24">
            <p className="kicker text-amber">Featured proof</p>
            <p className="mt-8 font-serif text-display font-light leading-none text-paper">
              40%
            </p>
            <p className="mt-6 max-w-2xl font-serif text-h1 font-light leading-tight text-paper">
              Cut cloud spend 40% — with zero performance cost.
            </p>
            <p className="mt-8 max-w-xl text-body text-paper/70">
              The bill came down; the experience didn't move. Savings as a business
              decision, not a tuning trick.
            </p>
            <div className="mt-10">
              <Button href="/work" variant="accent">
                Read the work
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Latest strip — newest resource · latest video. */}
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
            {/* Seam: live YouTube fetch mounts here. */}
            <div className="mt-5 aspect-video w-full rounded-lg border border-ink/10 bg-ink/[0.04]" />
            <p className="mt-4 text-small text-ink/60">
              The newest video loads here once the channel feed is wired.
            </p>
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

      {/* ── Email capture — prominent, repeated. */}
      <section className="container-content py-20 sm:py-28">
        <Reveal className="flex flex-col items-start gap-4">
          <EmailCapture />
        </Reveal>
      </section>
    </>
  );
}
