import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import CollectionCard from "@/components/CollectionCard";
import CommunityQuestionsSidebar from "@/components/CommunityQuestionsSidebar";
import AskQuestion from "@/components/AskQuestion";
import Button from "@/components/Button";
import { entryTypeMeta, getEntries, type EntryType } from "@/lib/library";
import { downloads } from "@/lib/downloads";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Case studies, interview prep, articles, and downloads, plus community questions answered in the open, real decisions and real answers, open for everyone.",
};

// Always reflect the live library when Supabase is configured.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const entries = await getEntries();
  const countOf = (type: EntryType) =>
    entries.filter((e) => e.type === type && e.published !== false).length;

  return (
    <>
      <PageBanner
        image={pageBanners.resources}
        kicker="Library"
        title="The content library."
        intro={
          <p>
            Case studies, interview prep, and articles, browsable by
            collection, plus community questions answered in the open. New
            content appears live.
          </p>
        }
      >
        <div className="flex flex-wrap gap-4">
          <Button href="/resources/case-studies">Case Studies</Button>
          <Button href="#community" variant="accent">
            Community Questions
          </Button>
          <Button href="/resources/downloads" variant="primary">
            Downloads
          </Button>
        </div>
      </PageBanner>

      {/* No Reveal wrapper around the grid: its transform would break the
          sticky Community Questions side banner. */}
      <section className="container-content py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_19rem] xl:grid-cols-[1fr_21rem] xl:gap-14">
          {/* ── Collections: click through to browse, then click any item to
              open and interact with it. */}
          <div className="min-w-0">
            <ul className="grid gap-6 sm:grid-cols-2">
              <CollectionCard
                href="/resources/case-studies"
                kind="case_study"
                label={entryTypeMeta.case_study.label}
                blurb={entryTypeMeta.case_study.blurb}
                count={countOf("case_study")}
              />
              <CollectionCard
                href="/resources/interview-prep"
                kind="course_qa"
                label={entryTypeMeta.course_qa.label}
                blurb={entryTypeMeta.course_qa.blurb}
                count={countOf("course_qa")}
              />
              <CollectionCard
                href="/resources/articles"
                kind="article"
                label={entryTypeMeta.article.label}
                blurb={entryTypeMeta.article.blurb}
                count={countOf("article")}
              />
              <CollectionCard
                href="/resources/downloads"
                kind="download"
                label="Downloads"
                blurb="Textbooks, slide decks, and short video clips, free to download."
                count={downloads.length}
              />
            </ul>
          </div>

          {/* ── Community Questions: unchanged, still the live side banner. */}
          <CommunityQuestionsSidebar initial={entries} />
        </div>
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
