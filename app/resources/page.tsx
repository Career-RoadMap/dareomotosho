import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ResourceLibrary from "@/components/ResourceLibrary";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A filterable library of guides, checklists, and templates. Filter by level so newcomers and architects can self-sort.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        kicker="Library"
        tone="cool"
        title="The library."
        intro={
          <p>
            Guides, checklists, and templates from the work. Filter by level so the
            right thing finds you — whether the words are still fog or you've built this
            before.
          </p>
        }
      />

      <section className="container-content pb-24">
        <Reveal>
          <ResourceLibrary resources={resources} />
        </Reveal>
      </section>
    </>
  );
}
