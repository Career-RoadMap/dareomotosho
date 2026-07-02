import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CollectionList from "@/components/CollectionList";
import { entryTypeMeta, getEntries } from "@/lib/library";

export const metadata: Metadata = {
  title: entryTypeMeta.article.label,
  description: entryTypeMeta.article.blurb,
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const entries = await getEntries();
  const items = entries.filter((e) => e.type === "article" && e.published !== false);

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
          {entryTypeMeta.article.label}
        </h1>
        <p className="mt-4 text-body text-ink/70">{entryTypeMeta.article.blurb}</p>
      </Reveal>
      <div className="mt-10">
        <CollectionList items={items} wide />
      </div>
    </div>
  );
}
