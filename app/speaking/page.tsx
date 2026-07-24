import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import InquiryForm from "@/components/InquiryForm";
import { talkTopics, episodes, outcomes } from "@/lib/content";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Technical speaker on cloud engineering and security governance",
  description:
    "A technical speaker on cloud engineering and security governance: a solutions architect's talks for career starters and boardrooms alike, rooted in systems I've actually built.",
};

export default function SpeakingPage() {
  const proofCases = outcomes.slice(0, 3);

  return (
    <>
      <PageBanner
        image={pageBanners.speaking}
        kicker="Speaking Engagement"
        title="Talks rooted in systems I've actually built."
        intro={
          <p>
            As a technical speaker on cloud engineering and security
            governance, here's the opinion I keep bringing to the stage,
            whether the room is career starters or a boardroom of solutions
            architects: every system an engineer builds is a business decision
            in disguise, and the industry trains almost no one to see it.
            That's the talk under all the talks.
          </p>
        }
      >
        <Button href="#book" variant="accent">Book a talk</Button>
      </PageBanner>

      {/* ── Bookable talk topics, one at a time. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <h2 className="font-serif text-h2 font-light text-signature">
            Book a technical speaker on cloud engineering and security
            governance for your stage
          </h2>
          <p className="mt-3 max-w-prose text-body text-ink/70">
            Speaking from the floor, not just the stage.
          </p>
        </Reveal>
        <div className="mt-10 space-y-4">
          {talkTopics.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <article className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
                <p className="kicker text-blue-lift">{t.audience}</p>
                <h3 className="mt-4 font-serif text-h2 font-light text-ink">
                  {t.title}
                </h3>
                <p className="mt-4 max-w-prose text-body text-ink">{t.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Proof, built work + podcast + decks. */}
      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <div className="rounded-3xl bg-signature p-10 text-paper sm:p-16">
            <p className="kicker text-amber">The proof</p>
            <h2 className="mt-6 max-w-2xl font-serif text-h1 font-light text-paper">
              Opinions earned in the build, not the abstract.
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {proofCases.map((c) => (
                <div key={c.title}>
                  <p className="font-serif text-h1 font-light leading-none text-paper">
                    {c.metric}
                  </p>
                  <p className="mt-3 text-small text-paper/70">{c.metricLabel}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 max-w-2xl text-body text-paper/70">
              Plus {episodes.length}+ podcast conversations and designed decks, the
              material is current, lived, and yours to vet before you book.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Book me. */}
      <section id="book" className="container-content scroll-mt-20 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-h1 font-light text-signature">Book me.</h2>
            <p className="mt-6 max-w-prose text-body text-ink">
              Tell me about the event and the audience. I'll reply with fit, a tailored
              angle, and logistics.
            </p>
          </Reveal>
          <Reveal>
            <InquiryForm
              submitLabel="Send booking inquiry"
              subject="New speaking booking, dareomotosho.com"
              fields={[
                { name: "name", label: "Your name", required: true, placeholder: "Jane Doe" },
                { name: "email", label: "Email", type: "email", required: true, placeholder: "you@event.com" },
                { name: "event", label: "Event / conference", required: true, placeholder: "QCon, internal summit…" },
                { name: "date", label: "Date or window", placeholder: "Q4 2026" },
                { name: "message", label: "Audience & what you're hoping for", type: "textarea", required: true, placeholder: "Who's in the room, and the talk you have in mind." },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
