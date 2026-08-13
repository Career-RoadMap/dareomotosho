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

// FAQPage structured data: makes these Q&As eligible for rich results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, build-time JSON from the site's own FAQ content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        kicker="FAQ"
        tone="cool"
        title="Questions, answered."
        intro={
          <p>
            The things people ask most. Don't see yours? Send it along at the bottom,
            good questions often become new answers here.
          </p>
        }
      />

      {/* FAQ content is content-managed in production (editable without redeploy). */}
      <section className="container-content py-6 sm:py-10">
        <Reveal>
          <FaqList items={faqs} />
        </Reveal>
      </section>

      {/* ── Optional visitor question submission. */}
      <section className="band-warm">
        <div className="container-content py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <Reveal>
              <h2 className="font-serif text-h2 font-light text-ink">Ask a question</h2>
              <p className="mt-5 max-w-prose text-body text-ink">
                If something is missing, ask it here. A personal reply is not promised to
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
        </div>
      </section>
    </>
  );
}
