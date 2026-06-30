import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import { social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "General questions and advisory or consulting inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        tone="cool"
        title="Let's talk."
        intro={
          <p>
            General questions, advisory and consulting inquiries, or just a hello, it
            all arrives in the same place, and I read it personally.
          </p>
        }
      />

      <section className="container-content py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">Reach out</h2>
            <p className="mt-5 max-w-prose text-body text-ink">
              Tell me a little about what you're after. For advisory and consulting,
              a sentence on the situation and the outcome is the most helpful start.
            </p>
            <div className="mt-8 space-y-3 text-body">
              <p>
                <a href={social.youtube} target="_blank" rel="noreferrer" className="link-quiet">
                  YouTube
                </a>
              </p>
              <p>
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="link-quiet">
                  LinkedIn
                </a>
              </p>
              <p>
                <a href={social.x} target="_blank" rel="noreferrer" className="link-quiet">
                  X / Twitter
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <InquiryForm
              submitLabel="Send message"
              subject="New contact message, dareomotosho.com"
              fields={[
                { name: "name", label: "Your name", required: true, placeholder: "Jane Doe" },
                { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
                { name: "topic", label: "Topic", placeholder: "General · Advisory · Consulting · Speaking" },
                { name: "message", label: "Your message", type: "textarea", required: true, placeholder: "How can I help?" },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
