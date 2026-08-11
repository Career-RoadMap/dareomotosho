import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import CollectionCard from "@/components/CollectionCard";
import CommunityQuestionsSidebar from "@/components/CommunityQuestionsSidebar";
import ToolLinks from "@/components/ToolLinks";
import AskQuestion from "@/components/AskQuestion";
import Button from "@/components/Button";
import ResourceCard from "@/components/ResourceCard";
import { entryTypeMeta, getEntries, type EntryType } from "@/lib/library";
import { getResources } from "@/lib/resources";
import { downloads } from "@/lib/downloads";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Case studies, interview prep, articles, and downloads, plus community questions answered in the open, real decisions and real answers, open for everyone.",
};

// Serve cached HTML instantly; re-render in the background at most once a
// minute so new library entries still appear promptly.
export const revalidate = 60;

export default async function ResourcesPage() {
  const [entries, resources] = await Promise.all([getEntries(), getResources()]);
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
          {/* Native anchor, not next/link: a hash-only router navigation
              re-mounts the page template and swallows the scroll. */}
          <a
            href="#community"
            className="inline-flex items-center justify-center rounded-lg bg-amber px-7 py-3.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95 focus-visible:ring-2"
          >
            Community Questions
          </a>
          <Button href="/resources/downloads" variant="primary">
            Downloads
          </Button>
        </div>
      </PageBanner>

      {/* ── The two standalone tools, right under the banner so they are the
          first thing reachable rather than the last. */}
      <div className="border-b border-ink/[0.07] bg-ink/[0.02]">
        <div className="container-content py-4">
          <ToolLinks />
        </div>
      </div>

      {/* ── Episode resources: one action tool per episode, newest first.
          Rendered straight from contents/resources/ (see
          RESOURCES-CONTRACT.md), so a new episode's file appears here with
          no code change. */}
      {resources.length > 0 ? (
        <section className="container-content pt-12 sm:pt-16">
          <Reveal>
            <span className="kicker">Episode Resources</span>
            <h2 className="mt-4 font-serif text-h2 font-light text-ink">
              One action tool per episode.
            </h2>
            <p className="mt-4 max-w-prose text-body text-ink">
              Every episode ships with a one-page tool you can put to work
              the same day, a sheet, a review, a log. Leave your email once
              and all of them open, including every future one.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </ul>
        </section>
      ) : null}

      {/* No Reveal wrapper around the grid: its transform would break the
          sticky Community Questions side banner. */}
      <section className="container-content py-12 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_19rem] xl:grid-cols-[1fr_21rem] xl:gap-14">
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
      <section className="band-warm">
        <div className="container-content py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
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
        </div>
      </section>
    </>
  );
}
