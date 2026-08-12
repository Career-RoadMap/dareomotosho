import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ResourceCard from "@/components/ResourceCard";
import { getResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "The Field Kit",
  description:
    "Every episode ends with a tool. One page you can take into your next review: a sheet, a review, a log. Free, and yours to download.",
};

// Cached, re-rendered in the background so a newly added kit appears
// promptly without a deploy-time rebuild of this page.
export const revalidate = 60;

/**
 * The Field Kit shelf: every episode tool, newest first, as preview cards.
 *
 * Read straight from contents/resources/ (RESOURCES-CONTRACT.md), so a new
 * markdown file lands here with no code edit. Cards are previews only —
 * title, takeaway, episode, domain — with the sheet itself behind each
 * kit's own page.
 *
 * NOTE: `field-kit` is a reserved slug. This static route takes precedence
 * over /resources/[slug], so a kit whose slug is literally "field-kit"
 * would be shadowed by this page. The contract records that reservation.
 */
export default async function FieldKitPage() {
  const resources = await getResources();

  return (
    <div className="container-content py-12 sm:py-16">
      <Reveal>
        <Link href="/resources" className="link-quiet text-small">
          ← Back to the library
        </Link>
      </Reveal>

      <Reveal className="mt-8 max-w-2xl sm:mt-10">
        <p className="kicker text-blue-lift">Library</p>
        <h1 className="mt-4 font-serif text-h1 font-light text-signature">
          The Field Kit
        </h1>
        <p className="mt-4 text-body text-ink">
          Every episode ends with a tool. Take it into your next review.
        </p>
        <p className="mt-3 text-small text-ink/70">
          Leave your email once and all of them open, including every future
          one, each with the sheet yours to download.
        </p>
      </Reveal>

      {resources.length > 0 ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-body text-ink/70">
          The first kit lands with the next episode.
        </p>
      )}
    </div>
  );
}
