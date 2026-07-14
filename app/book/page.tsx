import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { bookingUrl, contactEmail, pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Pick a time that works and let's talk: mentorship, advisory, speaking, or a question about your cloud and security posture.",
};

const fits = [
  {
    title: "Mentorship & career",
    body: "Where you are, where you're headed, and the next deliberate step in cloud or cybersecurity.",
  },
  {
    title: "Advisory & architecture",
    body: "A specific decision on your table: architecture, spend, security posture, or compliance that has to hold.",
  },
  {
    title: "Speaking & collaboration",
    body: "An event, a podcast, a workshop, or something we should build together.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.advisory}
        kicker="Booking"
        title="Pick a time. Bring the real question."
        intro={
          <p>
            Thirty minutes, no ceremony. Choose a slot on the calendar and
            come with the decision, the blocker, or the ambition you actually
            care about.
          </p>
        }
      >
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
        >
          Open the calendar
        </a>
      </PageBanner>

      {/* ── What a call is good for. */}
      <section className="container-content py-16 sm:py-20">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-ink">
            What we can use it for
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {fits.map((f, i) => (
            <Reveal as="div" key={f.title} delay={i * 90} className="bg-paper p-8 sm:p-10">
              <h3 className="font-serif text-h2 font-light text-signature">{f.title}</h3>
              <p className="mt-4 text-body text-ink">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The booking CTA, repeated where the decision lands. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal className="text-center">
          <div className="rounded-3xl bg-ink p-10 text-paper sm:p-16">
            <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-paper">
              The calendar is open.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body text-paper/70">
              Scheduling happens on Google Calendar; pick any open slot and
              you'll get the invite and the meeting link immediately.
            </p>
            <div className="mt-10">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
              >
                Book a call
              </a>
            </div>
            <p className="mt-8 text-small text-paper/55">
              No slot that fits? Write me instead:{" "}
              <a href={`mailto:${contactEmail}`} className="link-quiet !text-paper">
                {contactEmail}
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
