import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FilterableCollection from "@/components/FilterableCollection";
import { entryTypeMeta, getEntries } from "@/lib/library";

export const metadata: Metadata = {
  title: entryTypeMeta.course_qa.label,
  description: entryTypeMeta.course_qa.blurb,
};

// Serve cached HTML instantly; re-render in the background at most once a
// minute so new library entries still appear promptly.
export const revalidate = 60;

export default async function InterviewPrepPage() {
  const entries = await getEntries();
  const items = entries.filter((e) => e.type === "course_qa" && e.published !== false);

  return (
    <div className="container-content py-20 sm:py-28">
      <Reveal>
        <Link href="/resources" className="link-quiet text-small">
          ← Back to the library
        </Link>
      </Reveal>
      <Reveal className="mt-8 max-w-2xl sm:mt-10">
        <p className="kicker text-blue-lift">Library</p>
        <h1 className="mt-4 font-serif text-h1 font-light text-signature">
          {entryTypeMeta.course_qa.label}
        </h1>
        <p className="mt-4 text-body text-ink/70">{entryTypeMeta.course_qa.blurb}</p>
      </Reveal>
      <div className="mt-10">
        <FilterableCollection items={items} />
      </div>
    </div>
  );
}
