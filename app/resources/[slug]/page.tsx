import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Reveal from "@/components/Reveal";
import EntryInteractions from "@/components/EntryInteractions";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import { entryTypeMeta, getEntry, levelLabels, topicLabel } from "@/lib/library";

type Params = { slug: string };

// Each entry is rendered on first visit, then served from cache and
// re-rendered in the background at most once a minute.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) return { title: "Not found" };
  return { title: entry.title, description: entry.summary };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) notFound();

  return (
    <article className="container-content py-20 sm:py-28">
      <Reveal className="flex items-center justify-between gap-4 print:hidden">
        <Link href="/resources" className="link-quiet text-small">
          ← Back to the library
        </Link>
        {entry.type === "case_study" ? (
          <DownloadPdfButton label="Download PDF" />
        ) : null}
      </Reveal>

      <Reveal className="mt-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-small text-ink/55">
          <span className="kicker text-blue-lift">
            {entryTypeMeta[entry.type].label}
          </span>
          <span aria-hidden>·</span>
          <span>{topicLabel(entry.topic)}</span>
          <span aria-hidden>·</span>
          <span>{levelLabels[entry.level] ?? entry.level}</span>
        </div>
        <h1 className="mt-6 font-serif text-h1 font-light text-signature">
          {entry.title}
        </h1>
        {entry.asker ? (
          <p className="mt-4 text-small italic text-ink/55">{entry.asker}</p>
        ) : null}
        <p className="mt-6 text-body text-ink">{entry.summary}</p>
      </Reveal>

      {/* Long-form Markdown body */}
      <Reveal className="mt-10 max-w-3xl">
        <div className="prose-entry space-y-5 text-body text-ink">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
        </div>
      </Reveal>

      {/* Realtime discussion */}
      <div className="max-w-3xl print:hidden">
        <EntryInteractions entryId={entry.id} />
      </div>
    </article>
  );
}
