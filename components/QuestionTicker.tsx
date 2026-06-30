import Link from "next/link";
import type { CSSProperties } from "react";
import { topicLabel, type Entry } from "@/lib/library";

/**
 * Community Questions sidebar: a tall, portrait panel that auto-scrolls
 * through questions once they're populated. The track is duplicated so the
 * vertical loop is seamless; it pauses on hover and, under
 * prefers-reduced-motion, becomes a plain scrollable list (the duplicate
 * copy is hidden). Speed scales with the number of questions so a short list
 * doesn't race.
 */
export default function QuestionTicker({ items }: { items: Entry[] }) {
  if (items.length === 0) {
    return (
      <div className="flex h-[32rem] items-center justify-center rounded-3xl border border-ink/10 bg-paper p-8 text-center">
        <p className="text-small text-ink/50">
          No community questions yet. Be the first to ask one.
        </p>
      </div>
    );
  }

  // ~6s per question keeps reading comfortable; clamp so it's never too quick.
  const duration = `${Math.max(items.length, 4) * 6}s`;

  return (
    <div className="ticker relative h-[32rem] overflow-hidden rounded-3xl border border-ink/10 bg-paper motion-reduce:overflow-y-auto">
      {/* Soft fade at the top and bottom edges. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-paper to-transparent motion-reduce:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-paper to-transparent motion-reduce:hidden" />

      <ul
        className="ticker-track flex flex-col gap-4 p-5"
        style={{ "--ticker-duration": duration } as CSSProperties}
      >
        {[...items, ...items].map((e, i) => (
          <li
            key={`${e.id}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className={i >= items.length ? "motion-reduce:hidden" : undefined}
          >
            <Link
              href={`/resources/${e.slug}`}
              className="group block rounded-2xl border border-ink/10 bg-paper p-5 transition-colors duration-300 ease-calm hover:border-amber/60 hover:bg-paper/60"
            >
              <span className="kicker text-blue-lift">{topicLabel(e.topic)}</span>
              <p className="mt-3 font-serif text-xl font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                {e.title}
              </p>
              {e.asker ? (
                <p className="mt-2 text-small italic text-ink/50">{e.asker}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
