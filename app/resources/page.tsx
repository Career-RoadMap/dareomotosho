import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ResourcesSections from "@/components/ResourcesSections";
import AskQuestion from "@/components/AskQuestion";
import { getEntries } from "@/lib/library";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Case studies and community questions — real decisions and real answers, open for everyone.",
};

// Always reflect the live library when Supabase is configured.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const entries = await getEntries();

  return (
    <>
      <PageHero
        kicker="Library"
        tone="cool"
        title="The content library."
        intro={
          <p>
            Case studies showing how real systems were reasoned about, and
            questions from the community — answered in the open. New content
            appears live.
          </p>
        }
      />

      <section className="container-content pb-16">
        <Reveal>
          <ResourcesSections initial={entries} />
        </Reveal>
      </section>

      {/* ── Ask a question — submitted to the library, pending review. */}
      <section className="container-content py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">
              Have a question?
            </h2>
            <p className="mt-5 max-w-prose text-body text-ink">
              Ask it here. Good questions become answers in the library — once
              reviewed, yours appears for everyone, live.
            </p>
          </Reveal>
          <Reveal>
            <AskQuestion />
          </Reveal>
        </div>
      </section>
    </>
  );
}
