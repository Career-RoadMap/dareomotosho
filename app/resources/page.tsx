import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import LibraryBrowser from "@/components/LibraryBrowser";
import AskQuestion from "@/components/AskQuestion";
import { getEntries } from "@/lib/library";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A content library of course Q&A, case studies, and community questions — filter by topic and level to find what fits.",
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
            Course Q&amp;A, case studies, and questions from the community — read
            them here, filter by topic and level, and join the conversation. New
            answers and discussion appear live.
          </p>
        }
      />

      <section className="container-content pb-16">
        <Reveal>
          <LibraryBrowser initial={entries} />
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
