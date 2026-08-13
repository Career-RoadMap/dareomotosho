import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { bookingUrl, contactEmail, pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to Dare",
  description:
    "Thirty minutes for a mentoring question, a career decision, or a conversation about the writing on this site. Not a sales call.",
};

/**
 * What the call is actually for. Deliberately not commercial: this is a
 * mentoring and conversation slot, not a route into paid work.
 */
const fits = [
  {
    title: "Mentoring & career",
    body: "Where you are, where you're headed, and the next deliberate step in cloud or cybersecurity.",
  },
  {
    title: "A question from the writing",
    body: "Something on this site that did not land, or a Field Kit sheet you want to think through out loud.",
  },
  {
    title: "Community & the podcast",
    body: "A guest suggestion, a topic worth an episode, or a student community that could use a session.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.advisory}
        kicker="Talk to Dare"
        title="Thirty minutes. Bring the real question."
        intro={
          <p>
            Thirty minutes, no ceremony. Choose a slot and come with the
            question you actually care about: a career step, something on this
            site that did not land, or an idea worth an episode. This is a
            mentoring and conversation slot, not a sales call, and nothing is
            being sold on it.
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
      <section className="band">
        <div className="container-content py-12 sm:py-16">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">
              What the time is good for
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-ink/[0.14] bg-ink/[0.14] sm:grid-cols-3">
            {fits.map((f, i) => (
              <Reveal as="div" key={f.title} delay={i * 90} className="card-accent bg-paper p-7 sm:p-9">
                <h3 className="font-serif text-h2 font-light text-signature">{f.title}</h3>
                <p className="mt-4 text-body text-ink">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The booking CTA, repeated where the decision lands. */}
      <section className="band-warm">
        <div className="container-content py-12 sm:py-16">
          <Reveal className="text-center">
            <div className="rounded-3xl bg-ink p-10 text-paper sm:p-16">
              <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-paper">
                The calendar is open.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-body text-paper/70">
                Scheduling happens on Calendly; pick any open slot and
                you'll get the invite and the meeting link immediately.
              </p>
              <div className="mt-7">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
                >
                  Pick a time
                </a>
              </div>
              <p className="mt-8 text-small text-paper/55">
                No slot that fits? Write instead:{" "}
                <a href={`mailto:${contactEmail}`} className="link-quiet !text-paper">
                  {contactEmail}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
