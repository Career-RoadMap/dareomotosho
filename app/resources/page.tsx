import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import ResourcesSections from "@/components/ResourcesSections";
import AskQuestion from "@/components/AskQuestion";
import Button from "@/components/Button";
import { getEntries } from "@/lib/library";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Case studies and community questions, real decisions and real answers, open for everyone.",
};

// Always reflect the live library when Supabase is configured.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const entries = await getEntries();

  return (
    <>
      <PageBanner
        image={pageBanners.resources}
        kicker="Library"
        title="The content library."
        intro={
          <p>
            Case studies showing how real systems were reasoned about, and
            community questions, FAQs and course questions, answered in the
            open. New content appears live.
          </p>
        }
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#case-studies">Case Studies</Button>
          <Button href="#community" variant="accent">
            Community Questions
          </Button>
        </div>
      </PageBanner>

      <section className="container-content py-16 sm:py-20">
        <Reveal>
          <ResourcesSections initial={entries} />
        </Reveal>
      </section>

      {/* ── Ask a question, submitted to the library, pending review. */}
      <section className="container-content py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-h2 font-light text-ink">
              Have a question?
            </h2>
            <p className="mt-5 max-w-prose text-body text-ink">
              Ask it here. Good questions become answers in the library, once
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
