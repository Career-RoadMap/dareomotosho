"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { entryTypeMeta, levelLabels, type Entry } from "@/lib/library";
import { supabase } from "@/lib/supabase";

type SectionType = "case_study" | "user_question";

const SECTIONS: SectionType[] = ["case_study", "user_question"];

export default function ResourcesSections({ initial }: { initial: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [open, setOpen] = useState<Record<SectionType, boolean>>({
    case_study: true,
    user_question: true,
  });

  // Live: fold in newly published entries.
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client
      .channel("resources-feed")
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

  const toggle = (type: SectionType) =>
    setOpen((prev) => ({ ...prev, [type]: !prev[type] }));

  return (
    <div className="space-y-4">
      {SECTIONS.map((type) => {
        const items = entries.filter(
          (e) => e.type === type && e.published !== false,
        );
        const meta = entryTypeMeta[type];
        const isOpen = open[type];

        return (
          <div
            key={type}
            className="overflow-hidden rounded-2xl border border-ink/10"
          >
            {/* Dropdown header */}
            <button
              type="button"
              onClick={() => toggle(type)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 bg-paper px-8 py-6 text-left transition-colors duration-300 ease-calm hover:bg-paper/60"
            >
              <div>
                <h2 className="font-serif text-h2 font-light text-signature">
                  {meta.label}
                </h2>
                <p className="mt-1 text-small text-ink/55">{meta.blurb}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-small text-ink/40">{items.length}</span>
                <span
                  className={`block h-4 w-4 transition-transform duration-300 ease-calm text-ink/40 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </button>

            {/* Entries grid */}
            {isOpen && (
              <div className="border-t border-ink/10">
                {items.length === 0 ? (
                  <p className="px-8 py-10 text-small text-ink/50">
                    Nothing published yet — check back soon.
                  </p>
                ) : (
                  <ul className="grid gap-px bg-ink/10 sm:grid-cols-2">
                    {items.map((e) => (
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
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
