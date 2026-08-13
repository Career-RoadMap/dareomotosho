import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import { social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "General questions about the writing, the talks, or the Field Kit."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        tone="cool"
        title="Get in touch."
        intro={
          <p>
            Questions about the writing, the talks, or the Field Kit, or just a
            hello, it all arrives in the same place, and every note is read
            personally.
          </p>
        }
      />

      <section className="container-content py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">Reach out</h2>
            <p className="mt-5 max-w-prose text-body text-ink">
              A line or two of context helps. Questions about the writing, the
              talks, a Field Kit sheet, or the podcast all land here.
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
                { name: "topic", label: "Topic", placeholder: "General · The Field Kit · A talk · The podcast" },
                { name: "message", label: "Your message", type: "textarea", required: true, placeholder: "What would be useful?" },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
