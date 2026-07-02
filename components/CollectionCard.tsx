import Link from "next/link";

export type CollectionKind = "case_study" | "course_qa" | "article" | "download";

/**
 * A single clickable collection card on the /resources landing page (Case
 * Studies, Interview Prep, Articles, Downloads) and the Learn page's library
 * shortcuts. Click through to browse the full collection; from there, click
 * any item to open and interact with it. Each card sits on its own with a
 * shadow and a lift on hover, rather than blending into a shared grid line,
 * so the four (or three) options read as real doors, not a table.
 */
export default function CollectionCard({
  href,
  kind,
  label,
  blurb,
  count,
}: {
  href: string;
  kind: CollectionKind;
  label: string;
  blurb: string;
  count?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group relative flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-8 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-1 hover:border-amber/50 hover:shadow-xl hover:shadow-ink/10 sm:p-10"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-lift/10 text-blue-lift transition-colors duration-300 ease-calm group-hover:bg-amber/15 group-hover:text-amber">
            <CollectionIcon kind={kind} />
          </span>
          {typeof count === "number" ? (
            <span className="mt-1 shrink-0 text-small text-ink/45">{count}</span>
          ) : null}
        </div>
        <span className="mt-5 font-serif text-h2 font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
          {label}
        </span>
        <span className="mt-3 flex-1 text-body text-ink">{blurb}</span>
        <span className="mt-8 inline-flex items-center gap-2 text-small font-medium text-link">
          Enter
          <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}

function CollectionIcon({ kind }: { kind: CollectionKind }) {
  const cls = "h-6 w-6 fill-none stroke-current";
  if (kind === "case_study") {
    return (
      <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
        <path d="M9 3h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "course_qa") {
    return (
      <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
        <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        <path d="M12 9.5c0-.9.7-1.5 1.5-1.5s1.5.6 1.5 1.4c0 .9-1.5 1.1-1.5 2.1" strokeLinecap="round" />
        <circle cx="13.5" cy="14.2" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "article") {
    return (
      <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <path d="M7 8h6M7 12h10M7 16h10" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
