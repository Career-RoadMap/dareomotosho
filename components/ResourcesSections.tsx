"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { entryTypeMeta, levelLabels, topicLabel, type Entry, type EntryType } from "@/lib/library";
import { supabase } from "@/lib/supabase";

export default function ResourcesSections({ initial }: { initial: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(initial);

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

  const byType = (type: EntryType) =>
    entries.filter((e) => e.type === type && e.published !== false);

  return (
    <div className="space-y-16">
      {/* ── Case Studies. */}
      <Group
        id="case-studies"
        label={entryTypeMeta.case_study.label}
        blurb={entryTypeMeta.case_study.blurb}
        items={byType("case_study")}
      />

      {/* ── FAQs + Interview Prep (the #community anchor still lands here). */}
      <div id="community" className="scroll-mt-24 space-y-16">
        <Group
          id="faqs"
          label={entryTypeMeta.user_question.label}
          blurb={entryTypeMeta.user_question.blurb}
          items={byType("user_question")}
        />
        <Group
          id="course-questions"
          label={entryTypeMeta.course_qa.label}
          blurb={entryTypeMeta.course_qa.blurb}
          items={byType("course_qa")}
        />
      </div>
    </div>
  );
}

function Group({
  id,
  label,
  blurb,
  items,
  sub = false,
}: {
  id: string;
  label: string;
  blurb: string;
  items: Entry[];
  sub?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className={`font-serif font-light text-signature ${
            sub ? "text-h2" : "text-h1"
          }`}
        >
          {label}
        </h3>
        <span className="text-small text-ink/45">{items.length}</span>
      </div>
      <p className="mt-2 max-w-prose text-small text-ink/70">{blurb}</p>

      {items.length === 0 ? (
        <p className="mt-6 text-small text-ink/50">
          Nothing published here yet, check back soon.
        </p>
      ) : (
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {items.map((e) => (
            <li key={e.id}>
              <Link
                href={`/resources/${e.slug}`}
                className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 ease-calm hover:bg-paper/60"
              >
                <div className="flex items-center gap-3 text-small text-ink/50">
                  <span className="kicker text-blue-lift">{topicLabel(e.topic)}</span>
                  <span aria-hidden>·</span>
                  <span>{levelLabels[e.level] ?? e.level}</span>
                </div>
                <h4 className="mt-4 font-serif text-xl font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                  {e.title}
                </h4>
                <p className="mt-3 flex-1 text-small text-ink">{e.summary}</p>
                {e.asker ? (
                  <p className="mt-4 text-small italic text-ink/50">{e.asker}</p>
                ) : null}
                <span className="mt-6 inline-flex items-center gap-2 text-small text-link">
                  Continue Reading
                  <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
