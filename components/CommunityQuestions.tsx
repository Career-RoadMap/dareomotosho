"use client";

import { useMemo, useState, type CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { topicLabel, type Entry } from "@/lib/library";

/**
 * Community Questions: a searchable, filterable list of flip cards. Clicking a
 * question flips it in place to reveal the answer (no page navigation). When
 * nothing is being searched or flipped, the list gently auto-scrolls like a
 * news banner; any interaction switches it to a static, scrollable list.
 */
export default function CommunityQuestions({ items }: { items: Entry[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [flipped, setFlipped] = useState<Set<string>>(() => new Set());

  const topicOptions = useMemo(
    () => Array.from(new Set(items.map((i) => i.topic))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((e) => {
      if (topic !== "all" && e.topic !== topic) return false;
      if (!q) return true;
      return `${e.title} ${e.summary} ${e.body}`.toLowerCase().includes(q);
    });
  }, [items, query, topic]);

  // Auto-scroll only while the reader isn't searching, filtering, or reading.
  const idle = query.trim() === "" && topic === "all" && flipped.size === 0;

  function toggle(id: string) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Duplicate the list only for the seamless auto-scroll loop.
  const rendered = idle ? [...filtered, ...filtered] : filtered;
  const duration = `${Math.max(filtered.length, 4) * 6}s`;

  return (
    <div>
      <div className="mb-3 space-y-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search community questions"
          className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-small text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
        {topicOptions.length > 1 ? (
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Filter questions by topic"
            className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-small text-ink outline-none transition-colors duration-300 ease-calm focus:border-blue-lift"
          >
            <option value="all">All topics</option>
            {topicOptions.map((t) => (
              <option key={t} value={t}>
                {topicLabel(t)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-[28rem] items-center justify-center rounded-3xl border border-ink/10 bg-paper p-6 text-center">
          <p className="text-small text-ink/50">
            {items.length === 0
              ? "No community questions yet. Be the first to ask one."
              : "No questions match your search."}
          </p>
        </div>
      ) : (
        <div
          className={`relative h-[28rem] overflow-hidden rounded-3xl border border-ink/10 bg-paper ${
            idle ? "ticker motion-reduce:overflow-y-auto" : ""
          }`}
        >
          {idle ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-paper to-transparent motion-reduce:hidden" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-paper to-transparent motion-reduce:hidden" />
            </>
          ) : null}
          <ul
            className={`flex flex-col gap-4 p-4 ${
              idle ? "ticker-track" : "h-full overflow-y-auto"
            }`}
            style={
              idle ? ({ "--ticker-duration": duration } as CSSProperties) : undefined
            }
          >
            {rendered.map((e, i) => {
              const isDup = idle && i >= filtered.length;
              return (
                <li
                  key={`${e.id}-${i}`}
                  aria-hidden={isDup || undefined}
                  className={isDup ? "motion-reduce:hidden" : undefined}
                >
                  <FlipQuestion
                    entry={e}
                    flipped={flipped.has(e.id)}
                    onToggle={() => toggle(e.id)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlipQuestion({
  entry,
  flipped,
  onToggle,
}: {
  entry: Entry;
  flipped: boolean;
  onToggle: () => void;
}) {
  const face =
    "absolute inset-0 flex flex-col rounded-2xl border p-4 [backface-visibility:hidden]";
  const answer =
    entry.body?.trim() || entry.summary?.trim() || "This question is awaiting an answer.";

  return (
    <div className="group [perspective:1200px]">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={flipped}
        aria-label={`${entry.title}, ${flipped ? "hide" : "show"} answer`}
        className="relative block h-60 w-full text-left transition-transform duration-500 ease-calm [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front, the question. */}
        <span className={`${face} justify-between border-ink/10 bg-paper`}>
          <span className="kicker text-blue-lift">{topicLabel(entry.topic)}</span>
          <span className="font-serif text-lg font-light leading-snug text-ink">
            {entry.title}
          </span>
          <span className="inline-flex items-center gap-2 text-small text-amber">
            Reveal answer
            <span
              aria-hidden
              className="transition-transform duration-300 ease-calm group-hover:translate-x-1"
            >
              ↻
            </span>
          </span>
        </span>

        {/* Back, the answer (scrolls if long; reading it never flips the card). */}
        <span
          className={`${face} border-signature/20 bg-signature text-paper [transform:rotateY(180deg)]`}
        >
          <span className="mb-2 shrink-0 text-small font-medium text-amber">Answer</span>
          <span
            onClick={(e) => e.stopPropagation()}
            className="min-h-0 flex-1 overflow-y-auto pr-1 text-small leading-relaxed text-paper/90 [&_a]:underline [&_p+p]:mt-2"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </span>
          <span className="mt-2 shrink-0 text-small text-amber">Tap the edges to flip back ↺</span>
        </span>
      </button>
    </div>
  );
}
