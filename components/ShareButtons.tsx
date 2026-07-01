"use client";

import { useState } from "react";

/**
 * Share controls for a single card. X and LinkedIn open their web share
 * intents; TikTok has no link-share URL, so that button copies the link to
 * paste into the app. `path` is resolved against the live origin at click time
 * (so it's correct in any environment), and every handler stops propagation so
 * sharing never triggers the card's flip.
 */
export default function ShareButtons({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = () =>
    (typeof window !== "undefined" ? window.location.origin : "") + path;

  function openShare(kind: "twitter" | "linkedin") {
    const url = encodeURIComponent(fullUrl());
    const text = encodeURIComponent(title);
    const target =
      kind === "twitter"
        ? `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(target, "_blank", "noopener,noreferrer");
  }

  async function copyForTikTok() {
    try {
      await navigator.clipboard.writeText(fullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
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
      <button
        type="button"
        onClick={copyForTikTok}
        aria-label={`Copy link to "${title}" for TikTok`}
        className={btn}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      </button>
      {copied ? <span className="text-small text-amber">Copied</span> : null}
    </span>
  );
}
