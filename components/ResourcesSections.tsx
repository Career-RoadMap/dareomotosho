"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { entryTypeMeta, levelLabels, topicLabel, type Entry, type EntryType } from "@/lib/library";
import { supabase } from "@/lib/supabase";
import CommunityQuestions from "./CommunityQuestions";

/** Trim a summary to a max character count on a word boundary. */
function truncateChars(text: string, max = 200): string {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > 0 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, "") + "…";
}

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
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_19rem] xl:grid-cols-[1fr_21rem] xl:gap-14">
      {/* ── Main area: Case Studies and Interview Prep side by side, so both
          are visible at the top instead of one buried under the other.
          Articles run full width below, since they read better roomier. */}
      <div className="min-w-0 space-y-14">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <Group
            id="case-studies"
            label={entryTypeMeta.case_study.label}
            blurb={entryTypeMeta.case_study.blurb}
            items={byType("case_study")}
          />
          <Group
            id="course-questions"
            label={entryTypeMeta.course_qa.label}
            blurb={entryTypeMeta.course_qa.blurb}
            items={byType("course_qa")}
          />
        </div>
        <Group
          id="articles"
          label={entryTypeMeta.article.label}
          blurb={entryTypeMeta.article.blurb}
          items={byType("article")}
          wide
        />
      </div>

      {/* ── Community Questions: a live news banner running alongside the
          library. Sticks in view on desktop; drops below on mobile. */}
      <aside id="community" className="scroll-mt-24 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
          </span>
          <p className="kicker text-blue-lift">
            {entryTypeMeta.user_question.label}
          </p>
        </div>
        <CommunityQuestions items={byType("user_question")} />
      </aside>
    </div>
  );
}

function Group({
  id,
  label,
  blurb,
  items,
  sub = false,
  wide = false,
}: {
  id: string;
  label: string;
  blurb: string;
  items: Entry[];
  sub?: boolean;
  /** Full-width sections (e.g. Articles) show two cards per row on larger screens. */
  wide?: boolean;
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
        <ul
          className={`mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 ${
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
                <h4 className="mt-4 font-serif text-xl font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                  {e.title}
                </h4>
                <p className="mt-3 flex-1 text-small text-ink">
                  {truncateChars(e.summary, 200)}
                </p>
                {e.asker ? (
                  <p className="mt-4 text-small italic text-ink/50">{e.asker}</p>
                ) : null}
                <span className="mt-6 inline-flex items-center gap-2 text-small font-medium text-amber">
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
