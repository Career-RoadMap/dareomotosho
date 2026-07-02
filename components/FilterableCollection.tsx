"use client";

import { useMemo, useState } from "react";
import { topicLabel, type Entry } from "@/lib/library";
import CollectionList from "./CollectionList";

/**
 * Search + topic filter on top of a CollectionList, for the Case Studies,
 * Interview Prep, and Articles collection pages.
 */
export default function FilterableCollection({
  items,
  wide = false,
  emptyMessage = "No entries match your search.",
}: {
  items: Entry[];
  wide?: boolean;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

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

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search using keywords"
          aria-label="Search this collection"
          className="w-full flex-1 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
        />
        {topicOptions.length > 1 ? (
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Filter by topic"
            className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm focus:border-blue-lift sm:w-56"
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

      <div className="mt-8">
        {filtered.length === 0 && items.length > 0 ? (
          <p className="text-small text-ink/50">{emptyMessage}</p>
        ) : (
          <CollectionList items={filtered} wide={wide} />
        )}
      </div>
    </div>
  );
}
