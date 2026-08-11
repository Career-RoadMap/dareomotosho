import Link from "next/link";
import { domainLabel, type Resource } from "@/lib/resources";

/**
 * One episode resource on the /resources library page: the tool's name,
 * its one-line practice, the episode it ships with, and the domain. Same
 * lifted-card language as the collection cards, one size down.
 */
export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <li>
      <Link
        href={`/resources/${resource.slug}`}
        className="card-accent group relative flex h-full flex-col rounded-2xl border border-ink/[0.14] bg-paper p-7 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-1 hover:border-amber/50 hover:shadow-xl hover:shadow-ink/10 sm:p-8"
      >
        <span className="kicker text-blue-lift">{domainLabel(resource.domain)}</span>
        <span className="mt-4 font-serif text-2xl font-light leading-snug text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
          {resource.title}
        </span>
        <span className="mt-3 flex-1 text-body italic text-ink/75">
          &ldquo;{resource.takeaway}&rdquo;
        </span>
        <span className="mt-6 block text-small text-ink/55">
          From the episode: {resource.episode}
        </span>
        <span className="mt-4 inline-flex items-center gap-2 text-small font-medium text-link">
          Open the tool
          <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}
