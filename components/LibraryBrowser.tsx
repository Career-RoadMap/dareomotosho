"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  entryTypeMeta,
  levelLabels,
  type Entry,
  type EntryType,
} from "@/lib/library";
import { supabase } from "@/lib/supabase";

const TYPE_ORDER: EntryType[] = ["course_qa", "case_study", "user_question"];

type TypeFilter = "all" | EntryType;

/**
 * The content library index. Filter by type (the three models), topic, and
 * level so visitors self-sort. When Supabase is configured it also subscribes
 * to newly published entries and folds them in live.
 */
export default function LibraryBrowser({ initial }: { initial: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [type, setType] = useState<TypeFilter>("all");
  const [topic, setTopic] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  // Live: fold in entries as they're published.
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client
      .channel("entries-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entries" },
        (payload) => {
          const row = payload.new as Entry;
          if (!row || !row.published) return;
          setEntries((prev) =>
            prev.some((e) => e.id === row.id)
              ? prev.map((e) => (e.id === row.id ? row : e))
              : [row, ...prev],
          );
        },
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const topicOptions = useMemo(
    () => ["all", ...Array.from(new Set(entries.map((e) => e.topic)))],
    [entries],
  );
  const levelOptions = useMemo(
    () => ["all", ...Array.from(new Set(entries.map((e) => e.level)))],
    [entries],
  );

  const filtered = entries.filter(
    (e) =>
      (type === "all" || e.type === type) &&
      (topic === "all" || e.topic === topic) &&
      (level === "all" || e.level === level),
  );

  const sections =
    type === "all"
      ? TYPE_ORDER.map((t) => ({
          type: t,
          items: filtered.filter((e) => e.type === t),
        })).filter((s) => s.items.length > 0)
      : [{ type: type as EntryType, items: filtered }];

  return (
    <div>
      {/* Filters */}
      <div className="space-y-5 border-y border-ink/10 py-8">
        <FilterRow label="Type">
          <Chip active={type === "all"} onClick={() => setType("all")}>
            All
          </Chip>
          {TYPE_ORDER.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {entryTypeMeta[t].label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Topic">
          {topicOptions.map((t) => (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t === "all" ? "All" : t}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Level">
          {levelOptions.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === "all" ? "All" : levelLabels[l] ?? l}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <p className="mt-10 text-body text-ink/60">
          Nothing matches that combination yet. Try widening a filter.
        </p>
      ) : (
        <div className="mt-12 space-y-16">
          {sections.map((section) => (
            <section key={section.type}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-h2 font-light text-signature">
                  {entryTypeMeta[section.type].label}
                </h2>
                <span className="text-small text-ink/45">
                  {section.items.length}
                </span>
              </div>
              <p className="mt-2 max-w-prose text-small text-ink/70">
                {entryTypeMeta[section.type].blurb}
              </p>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
                {section.items.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/resources/${e.slug}`}
                      className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60"
                    >
                      <div className="flex items-center gap-3 text-small text-ink/50">
                        <span className="kicker text-blue-lift">{e.topic}</span>
                        <span aria-hidden>·</span>
                        <span>{levelLabels[e.level] ?? e.level}</span>
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                        {e.title}
                      </h3>
                      <p className="mt-3 flex-1 text-small text-ink">{e.summary}</p>
                      {e.asker ? (
                        <p className="mt-4 text-small italic text-ink/50">{e.asker}</p>
                      ) : null}
                      <span className="mt-6 inline-flex items-center gap-2 text-small text-link">
                        Read
                        <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="kicker w-20 shrink-0 text-ink/55">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-small transition-colors duration-300 ease-calm ${
        active
          ? "border-signature bg-signature text-paper"
          : "border-ink/15 text-ink hover:border-blue-lift hover:text-blue-lift"
      }`}
    >
      {children}
    </button>
  );
}
