"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Level, Resource, ResourceType } from "@/lib/content";

type Filter = "all" | string;

/**
 * Filterable resource index. Functional page — motion stays minimal
 * (cards fade in via the page's Reveal wrappers; filtering is instant).
 * Filter by level so newcomers and architects self-sort.
 */
export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [level, setLevel] = useState<Filter>("all");
  const [type, setType] = useState<Filter>("all");
  const [topic, setTopic] = useState<Filter>("all");

  const levels = useMemo(
    () => ["all", ...Array.from(new Set(resources.map((r) => r.level)))],
    [resources],
  );
  const types = useMemo(
    () => ["all", ...Array.from(new Set(resources.map((r) => r.type)))],
    [resources],
  );
  const topics = useMemo(
    () => ["all", ...Array.from(new Set(resources.map((r) => r.topic)))],
    [resources],
  );

  const filtered = resources.filter(
    (r) =>
      (level === "all" || r.level === (level as Level)) &&
      (type === "all" || r.type === (type as ResourceType)) &&
      (topic === "all" || r.topic === topic),
  );

  return (
    <div>
      <div className="space-y-6 border-y border-ink/10 py-8">
        <FilterRow label="Level" value={level} options={levels} onChange={setLevel} />
        <FilterRow label="Type" value={type} options={types} onChange={setType} />
        <FilterRow label="Topic" value={topic} options={topics} onChange={setTopic} />
      </div>

      <p className="mt-8 text-small text-ink/55">
        {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
      </p>

      <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
        {filtered.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/resources/${r.slug}`}
              className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60"
            >
              <div className="flex items-center gap-3 text-small text-ink/50">
                <span className="kicker text-blue-lift">{r.type}</span>
                <span aria-hidden>·</span>
                <span>{r.level}</span>
              </div>
              <h3 className="mt-4 font-serif text-h2 font-light text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                {r.title}
              </h3>
              <p className="mt-3 flex-1 text-small text-ink/70">{r.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-small text-link">
                View
                <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-10 text-body text-ink/60">
          Nothing matches that combination yet. Try widening a filter.
        </p>
      ) : null}
    </div>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Filter;
  options: string[];
  onChange: (v: Filter) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="kicker w-20 shrink-0 text-ink/55">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-small transition-colors duration-300 ease-calm ${
                active
                  ? "border-signature bg-signature text-paper"
                  : "border-ink/15 text-ink/70 hover:border-blue-lift hover:text-blue-lift"
              }`}
            >
              {opt === "all" ? "All" : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
