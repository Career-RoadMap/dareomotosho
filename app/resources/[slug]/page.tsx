import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Reveal from "@/components/Reveal";
import EntryInteractions from "@/components/EntryInteractions";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import { entryTypeMeta, getEntry, levelLabels, topicLabel } from "@/lib/library";
import { siteUrl } from "@/lib/site";

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
  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: "article",
      publishedTime: entry.created_at,
      modifiedTime: entry.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.summary,
    },
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) notFound();

  // The seeder derives summaries from the body's opening lines, so on the
  // full page the standfirst usually just repeats the first paragraph
  // (e.g. "Question 1: …" showing twice on Interview Prep entries). Show it
  // only when it's genuinely distinct from how the body opens.
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[#*_`>“”"']/g, "").replace(/\s+/g, " ").trim();
  const summaryProbe = normalize(entry.summary).replace(/…$/, "").slice(0, 80);
  const summaryRepeatsBody =
    summaryProbe.length > 0 &&
    normalize(entry.body).slice(0, 400).includes(summaryProbe);

  // Send readers back to the collection they came from, not the top library.
  const backLinks: Record<string, { href: string; label: string }> = {
    course_qa: { href: "/resources/interview-prep", label: "Back to Interview Prep" },
    article: { href: "/resources/articles", label: "Back to Articles" },
    case_study: { href: "/resources/case-studies", label: "Back to Case Studies" },
  };
  const back = backLinks[entry.type] ?? { href: "/resources", label: "Back to the library" };

  // Breadcrumb structured data: Home → Resources → this entry.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${siteUrl}/resources` },
      { "@type": "ListItem", position: 3, name: entry.title, item: `${siteUrl}/resources/${entry.slug}` },
    ],
  };

  return (
    <article className="container-content py-20 sm:py-28">
      <script
        type="application/ld+json"
        // Built from the entry's own title/slug, values the page already renders.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Reveal className="flex items-center justify-between gap-4 print:hidden">
        <Link href={back.href} className="link-quiet text-small">
          ← {back.label}
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
        {summaryRepeatsBody ? null : (
          <p className="mt-6 text-body text-ink">{entry.summary}</p>
        )}
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
