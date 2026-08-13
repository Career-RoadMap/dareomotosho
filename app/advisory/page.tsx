import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advisory work",
  description:
    "A record of cloud and cybersecurity advisory work: what the engagements were for, how they ran, and what they left behind.",
};

/** What past advisory engagements were measured by, stated as outcomes. */
const outcomes = [
  {
    title: "Decisions that held up",
    body: "Architecture and spend choices the team could defend at the table, and live with a year later.",
  },
  {
    title: "Judgment that compounded",
    body: "Not a dependency on any one adviser, but a team that thought in business terms afterwards.",
  },
  {
    title: "Risk sized to reality",
    body: "Security and resilience matched to the threat actually faced, not the one that sells fear.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.advisory}
        kicker="Advisory work"
        title="Judgment, built into the team."
        intro={
          <p>
            A record of the advisory work, and the approach behind it. Real
            cloud and cybersecurity advisory does not just fix the system, it
            leaves the team able to make the next call themselves. These
            engagements were built around business-aligned judgment: the ability
            to see the decision inside the system, and to make it well. The
            measure was never being needed twice.
          </p>
        }
      >
        <Button href="/work" variant="accent">See the systems</Button>
      </PageBanner>

      {/* ── Outcomes language. */}
      <section className="band">
        <div className="container-content py-10 sm:py-12">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center font-serif text-h2 font-light text-signature">
              Cloud and cybersecurity advisory for teams that wanted the
              judgment, not just the fix.
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-ink/[0.14] bg-ink/[0.14] sm:grid-cols-3">
            {outcomes.map((o, i) => (
              <Reveal as="div" key={o.title} delay={i * 90} className="card-accent bg-paper p-7 sm:p-9">
                <h3 className="font-serif text-h2 font-light text-signature">{o.title}</h3>
                <p className="mt-4 text-body text-ink">{o.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Register-setting statement on a deep surface. */}
      <section className="container-content py-12 sm:py-16">
        <Reveal>
          <div className="rounded-3xl bg-ink p-10 text-paper sm:p-16">
            <p className="kicker text-amber">How the work ran</p>
            <p className="mt-6 max-w-3xl font-serif text-h1 font-light leading-tight text-paper">
              Engaged where the trade-offs were made, quietly, and with the people who
              had to own the call.
            </p>
            <p className="mt-8 max-w-2xl text-body text-paper/70">
              A small number of engagements at a time, sized to the decision rather than
              the calendar. Deliberate, and accountable to outcomes.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Where to read more. This page is a record of work, not an offer,
          so it closes by pointing at the work rather than at a form. */}
      <section className="band-warm">
        <div className="container-content py-10 sm:py-12">
          <Reveal className="text-center">
            <h2 className="mx-auto max-w-2xl font-serif text-h1 font-light text-signature">
              The systems behind the advice.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body text-ink">
              The case studies set out the same decisions in full: what was
              chosen, what it cost, and what it closed off.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/work" variant="accent">See the work</Button>
              <Button href="/resources/case-studies" variant="ghost">
                Read the case studies
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
