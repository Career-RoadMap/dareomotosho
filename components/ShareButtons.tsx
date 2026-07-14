"use client";

/**
 * Share controls for a single card: X and LinkedIn web share intents.
 * `path` is resolved against the live origin at click time (so it's correct
 * in any environment), and every handler stops propagation so sharing never
 * triggers the card's flip. Intents open in a sized popup, LinkedIn serves
 * its lightweight share dialog there instead of loading the full app shell,
 * which is what made sharing feel slow in a plain new tab.
 */
export default function ShareButtons({ path, title }: { path: string; title: string }) {
  const fullUrl = () =>
    (typeof window !== "undefined" ? window.location.origin : "") + path;

  function openShare(kind: "twitter" | "linkedin") {
    const url = encodeURIComponent(fullUrl());
    const text = encodeURIComponent(title);
    const target =
      kind === "twitter"
        ? `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    const w = 600;
    const h = 600;
    const left = Math.max(0, (window.screen.width - w) / 2);
    const top = Math.max(0, (window.screen.height - h) / 2);
    window.open(
      target,
      "share-dialog",
      `noopener,noreferrer,width=${w},height=${h},left=${left},top=${top}`,
    );
  }

  const btn =
    "inline-flex h-7 w-7 items-center justify-center rounded-full text-ink/55 transition-colors duration-200 ease-calm hover:bg-ink/[0.06] hover:text-amber";

  return (
    <span
      className="inline-flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => openShare("twitter")}
        aria-label={`Share "${title}" on X`}
        className={btn}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => openShare("linkedin")}
        aria-label={`Share "${title}" on LinkedIn`}
        className={btn}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      </button>
    </span>
  );
}
