import Link from "next/link";
import { levelLabels, topicLabel, type Entry } from "@/lib/library";
import ShareButtons from "./ShareButtons";

/** Trim a summary to a max character count on a word boundary. */
function truncateChars(text: string, max = 200): string {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > 0 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, "") + "…";
}

/**
 * The card grid used on each collection page (Case Studies, Interview Prep,
 * Articles): every card links straight into the individual entry.
 */
export default function CollectionList({
  items,
  wide = false,
}: {
  items: Entry[];
  /** Two cards per row on larger screens, for roomier long-form content. */
  wide?: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-6 text-small text-ink/50">
        Nothing published here yet, check back soon.
      </p>
    );
  }

  return (
    <ul
      className={`grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 ${
        wide ? "sm:grid-cols-2" : ""
      }`}
    >
      {items.map((e) => (
        <li key={e.id}>
          <Link
            href={`/resources/${e.slug}`}
            className="group flex h-full flex-col bg-paper p-6 transition-colors duration-300 ease-calm hover:bg-paper/60"
          >
            <div className="flex items-center gap-3 text-small text-ink/50">
              <span className="kicker text-blue-lift">{topicLabel(e.topic)}</span>
              <span aria-hidden>·</span>
              <span>{levelLabels[e.level] ?? e.level}</span>
            </div>
            <h2 className="mt-4 font-serif text-xl font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
              {e.title}
            </h2>
            <p className="mt-3 flex-1 text-small text-ink">
              {truncateChars(e.summary, 200)}
            </p>
            {e.asker ? (
              <p className="mt-4 text-small italic text-ink/50">{e.asker}</p>
            ) : null}
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-small font-medium text-amber">
                Continue Reading
                <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
                  →
                </span>
              </span>
              <ShareButtons path={`/resources/${e.slug}`} title={e.title} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
