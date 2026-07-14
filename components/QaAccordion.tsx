"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { levelLabels, topicLabel, type Entry } from "@/lib/library";
import ShareButtons from "./ShareButtons";

type QaPair = { n: string; question: string; answer: string };

/**
 * Split a course-Q&A body into its individual question/answer pairs. The
 * source documents follow a consistent shape:
 *
 *   Question 1: "…question text…" (optional audience tag)
 *   High-Authority Answer: …answer paragraphs…
 *   Question 2: …
 *
 * Returns [] when the body doesn't follow the pattern, so the caller can
 * fall back to showing the whole entry as one disclosure.
 */
function parseQaPairs(body: string): QaPair[] {
  const segments = body.split(/(?=(?:^|\n)\s*Question\s+\d+\s*:)/);
  const pairs: QaPair[] = [];
  for (const seg of segments) {
    const m = seg.match(
      /^\s*Question\s+(\d+)\s*:\s*([\s\S]*?)\n*\s*High-Authority Answer\s*:?\s*\n*([\s\S]*)$/,
    );
    if (!m) continue;
    // Drop the decorative outer quotes around the question, keep the rest
    // (including any audience tag like "(CISO / CTO)") verbatim.
    const question = m[2]
      .trim()
      .replace(/^[“"']+/, "")
      .replace(/[”"']+\s*$/, "")
      // A closing quote before a trailing audience tag: …secure?" (CISO / CTO)
      .replace(/[”"']+\s*(\([^)]*\))\s*$/, " $1")
      .trim();
    const answer = m[3].trim();
    if (question && answer) pairs.push({ n: m[1], question, answer });
  }
  return pairs;
}

/**
 * Q&A view for the Interview Prep collection: one section per course, and
 * inside it one <details> dropdown per question, revealing that question's
 * answer. Falls back to a single disclosure for entries that don't follow
 * the Question/Answer document shape.
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
    <div className="space-y-12">
      {items.map((entry) => {
        const pairs = parseQaPairs(entry.body);
        return (
          <section key={entry.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 text-small text-ink/50">
                  <span className="kicker text-blue-lift">{topicLabel(entry.topic)}</span>
                  <span aria-hidden>·</span>
                  <span>{levelLabels[entry.level] ?? entry.level}</span>
                </div>
                <h2 className="mt-2 font-serif text-h2 font-light text-signature">
                  {entry.title}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/resources/${entry.slug}`} className="link-quiet text-small">
                  Open full page
                </Link>
                <ShareButtons path={`/resources/${entry.slug}`} title={entry.title} />
              </div>
            </div>

            {pairs.length > 0 ? (
              <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
                {pairs.map((qa) => (
                  <li key={qa.n}>
                    <details className="group bg-paper">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 transition-colors duration-300 ease-calm hover:bg-paper/60 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex items-start gap-4">
                          <span className="kicker mt-1 shrink-0 text-amber">Q{qa.n}</span>
                          <span className="font-serif text-lg font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                            {qa.question}
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
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{qa.answer}</ReactMarkdown>
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
                <details className="group bg-paper">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 transition-colors duration-300 ease-calm hover:bg-paper/60 [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-lg font-medium text-ink">
                      Read the answers
                    </span>
                    <span
                      aria-hidden
                      className="block h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 ease-calm group-open:rotate-180"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 7.5l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <div className="prose-entry space-y-4 border-t border-ink/10 pt-5 text-body text-ink">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
