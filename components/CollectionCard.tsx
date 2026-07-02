import Link from "next/link";

/**
 * A single clickable collection card on the /resources landing page (Case
 * Studies, Interview Prep, Articles, Downloads). Click through to browse the
 * full collection; from there, click any item to open and interact with it.
 */
export default function CollectionCard({
  href,
  label,
  blurb,
  count,
}: {
  href: string;
  label: string;
  blurb: string;
  count?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60 sm:p-10"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="font-serif text-h2 font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
            {label}
          </span>
          {typeof count === "number" ? (
            <span className="mt-1 shrink-0 text-small text-ink/45">{count}</span>
          ) : null}
        </div>
        <span className="mt-4 flex-1 text-body text-ink">{blurb}</span>
        <span className="mt-8 inline-flex items-center gap-2 text-small text-link">
          Enter
          <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}
