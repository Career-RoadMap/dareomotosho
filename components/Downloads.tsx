import Reveal from "@/components/Reveal";
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

  return (
    <section id="downloads" className="scroll-mt-24">
      <Reveal>
        <h2 className="font-serif text-h1 font-light text-signature">Downloads</h2>
        <p className="mt-2 max-w-prose text-body text-ink/70">
          Textbooks, slide decks, and short video clips, free to download.
        </p>
      </Reveal>

      {!hasAny ? (
        <p className="mt-8 text-small text-ink/50">
          Downloads are coming soon, check back shortly.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {downloadKinds.map((kind) => {
            const items = downloads.filter((d) => d.kind === kind);
            if (items.length === 0) return null;
            return (
              <div key={kind}>
                <h3 className="font-serif text-h2 font-light text-ink">
                  {downloadKindMeta[kind].label}
                </h3>
                <p className="mt-1 max-w-prose text-small text-ink/60">
                  {downloadKindMeta[kind].blurb}
                </p>
                <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
                  {items.map((d) => (
                    <li key={d.file}>
                      <a
                        href={d.file}
                        download
                        className="group flex h-full items-start gap-4 bg-paper p-6 transition-colors duration-300 ease-calm hover:bg-paper/60"
                      >
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
                          <span className="mt-3 inline-flex items-center gap-2 text-small font-medium text-amber">
                            Download{d.size ? ` · ${d.size}` : ""}
                            <span
                              aria-hidden
                              className="transition-transform duration-300 ease-calm group-hover:translate-y-0.5"
                            >
                              ↓
                            </span>
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
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
