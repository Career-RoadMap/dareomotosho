import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FaqList from "@/components/FaqList";
import InquiryForm from "@/components/InquiryForm";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the questions that come up most.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="FAQ"
        tone="cool"
        title="Questions, answered."
        intro={
          <p>
            The things people ask most. Don't see yours? Send it along at the bottom —
            good questions often become new answers here.
          </p>
        }
      />

      {/* FAQ content is content-managed in production (editable without redeploy). */}
      <section className="container-content py-8 sm:py-12">
        <Reveal>
          <FaqList items={faqs} />
        </Reveal>
      </section>

      {/* ── Optional visitor question submission. */}
      <section className="container-content py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">Ask a question</h2>
            <p className="mt-5 max-w-prose text-body text-ink">
              If something's missing, ask it here. I can't promise a personal reply to
              every one, but the most common ones get added above.
            </p>
          </Reveal>
          <Reveal>
            <InquiryForm
              submitLabel="Submit question"
              fields={[
                { name: "email", label: "Email (optional)", type: "email", placeholder: "you@example.com" },
                { name: "question", label: "Your question", type: "textarea", required: true, placeholder: "What would you like to know?" },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
