"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import ShareButtons from "@/components/ShareButtons";
import {
  downloads,
  downloadKinds,
  downloadKindMeta,
  type DownloadKind,
} from "@/lib/downloads";

/**
 * Downloadable resources on /resources: textbooks, slide decks, and video
 * clips. Renders a section per kind that has files; shows a calm empty state
 * until the first file is added (see /public/downloads/README.md).
 */
export default function Downloads() {
  const hasAny = downloads.length > 0;
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | DownloadKind>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return downloads.filter((d) => {
      if (kind !== "all" && d.kind !== kind) return false;
      if (!q) return true;
      return `${d.title} ${d.description || ""}`.toLowerCase().includes(q);
    });
  }, [query, kind]);

  return (
    <div>
      <Reveal>
        <h1 className="font-serif text-h1 font-light text-signature">Downloads</h1>
        <p className="mt-2 max-w-prose text-body text-ink/70">
          Textbooks, slide decks, and short video clips, free to download.
        </p>
      </Reveal>

      {!hasAny ? (
        <p className="mt-8 text-small text-ink/50">
          Downloads are coming soon, check back shortly.
        </p>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search using keywords"
              aria-label="Search downloads"
              className="w-full flex-1 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm placeholder:text-ink/35 focus:border-blue-lift"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as "all" | DownloadKind)}
              aria-label="Filter by kind"
              className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-body text-ink outline-none transition-colors duration-300 ease-calm focus:border-blue-lift sm:w-56"
            >
              <option value="all">All kinds</option>
              {downloadKinds.map((k) => (
                <option key={k} value={k}>
                  {downloadKindMeta[k].label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-small text-ink/50">No downloads match your search.</p>
          ) : (
            <div className="mt-10 space-y-12">
              {downloadKinds.map((k) => {
                const items = filtered.filter((d) => d.kind === k);
                if (items.length === 0) return null;
                return (
                  <div key={k}>
                    <h3 className="font-serif text-h2 font-light text-ink">
                      {downloadKindMeta[k].label}
                    </h3>
                    <p className="mt-1 max-w-prose text-small text-ink/60">
                      {downloadKindMeta[k].blurb}
                    </p>
                    <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
                      {items.map((d) => (
                        <li key={d.file}>
                          <div className="group flex h-full flex-col bg-paper p-6 transition-colors duration-300 ease-calm hover:bg-paper/60">
                            <a href={d.file} download className="flex flex-1 items-start gap-4">
                              <KindIcon kind={d.kind} />
                              <span className="min-w-0 flex-1">
                                <span className="block font-serif text-lg font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
                                  {d.title}
                                </span>
                                {d.description ? (
                                  <span className="mt-1 block text-small text-ink/70">
                                    {d.description}
                                  </span>
                                ) : null}
                              </span>
                            </a>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <a
                                href={d.file}
                                download
                                className="inline-flex items-center gap-2 text-small font-medium text-amber"
                              >
                                Download{d.size ? ` · ${d.size}` : ""}
                                <span
                                  aria-hidden
                                  className="transition-transform duration-300 ease-calm group-hover:translate-y-0.5"
                                >
                                  ↓
                                </span>
                              </a>
                              <ShareButtons path={d.file} title={d.title} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function KindIcon({ kind }: { kind: DownloadKind }) {
  const cls = "mt-0.5 h-6 w-6 shrink-0 fill-none stroke-blue-lift";
  if (kind === "clip") {
    return (
      <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M10 9l5 3-5 3z" className="fill-blue-lift" />
      </svg>
    );
  }
  if (kind === "slides") {
    return (
      <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M12 16v3m-3 0h6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cls} strokeWidth="1.6" aria-hidden>
      <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M14 4v5h5" strokeLinejoin="round" />
    </svg>
  );
}
