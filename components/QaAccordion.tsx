"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { levelLabels, topicLabel, type Entry } from "@/lib/library";
import ShareButtons from "./ShareButtons";

/**
 * Q&A accordion for the Interview Prep collection: each question is a
 * native <details> disclosure that reveals the full answer inline. Keeps a
 * quiet link out to the entry's own page for sharing/printing.
 */
export default function QaAccordion({ items }: { items: Entry[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-6 text-small text-ink/50">
        Nothing published here yet, check back soon.
      </p>
    );
  }

  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
      {items.map((e) => (
        <li key={e.id}>
          <details className="group bg-paper">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 transition-colors duration-300 ease-calm hover:bg-paper/60 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="flex items-center gap-3 text-small text-ink/50">
                  <span className="kicker text-blue-lift">{topicLabel(e.topic)}</span>
                  <span aria-hidden>·</span>
                  <span>{levelLabels[e.level] ?? e.level}</span>
                </span>
                <span className="mt-3 block font-serif text-xl font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                  {e.title}
                </span>
              </span>
              <span
                aria-hidden
                className="mt-1 block h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 ease-calm group-open:rotate-180"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 7.5l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>
            <div className="px-6 pb-6">
              <div className="prose-entry space-y-4 border-t border-ink/10 pt-5 text-body text-ink">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{e.body}</ReactMarkdown>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  href={`/resources/${e.slug}`}
                  className="link-quiet text-small"
                >
                  Open full page
                </Link>
                <ShareButtons path={`/resources/${e.slug}`} title={e.title} />
              </div>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
