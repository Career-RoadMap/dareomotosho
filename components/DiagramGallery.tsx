"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Diagram } from "@/lib/content";

/**
 * Architecture diagram gallery. Diagrams crossfade from one to the next in
 * place (gentle auto-advance, paused on hover), with prev/next and dot
 * controls. Clicking opens a lightbox to view them larger like a photo
 * gallery, with keyboard navigation. Auto-advance is disabled under
 * prefers-reduced-motion. Images are placeholders — swap in real diagrams.
 */
export default function DiagramGallery({ diagrams }: { diagrams: Diagram[] }) {
  const count = diagrams.length;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal target only exists on the client.
  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  // Gentle auto-advance — paused on hover, in the lightbox, or reduced motion.
  useEffect(() => {
    if (paused || lightbox || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [paused, lightbox, count]);

  // Lock scroll + wire keyboard while the lightbox is open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, go]);

  const current = diagrams[index];

  const arrowBtn =
    "absolute top-1/2 z-10 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-xl text-ink backdrop-blur transition-colors duration-300 ease-calm hover:text-amber";

  return (
    <div>
      {/* In-place viewer — click to open the lightbox. */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label={`View ${current.title} larger`}
          className="group block w-full overflow-hidden rounded-3xl border border-ink/10 bg-paper transition-shadow duration-300 ease-calm hover:ring-2 hover:ring-amber"
        >
          <div className="relative aspect-video w-full">
            {diagrams.map((d, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={d.src}
                src={d.src}
                alt={d.title}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-calm ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 text-small text-paper opacity-0 transition-opacity duration-300 ease-calm group-hover:opacity-100">
              Click to enlarge
            </span>
          </div>
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={`${arrowBtn} left-4`}
              aria-label="Previous diagram"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={`${arrowBtn} right-4`}
              aria-label="Next diagram"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Caption + dot controls. */}
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-prose">
          <h3 className="font-serif text-h2 font-light text-ink">{current.title}</h3>
          <p className="mt-2 text-small text-ink">{current.caption}</p>
        </div>
        {count > 1 && (
          <div className="flex items-center gap-2" role="tablist" aria-label="Diagrams">
            {diagrams.map((d, i) => (
              <button
                key={d.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${d.title}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ease-calm ${
                  i === index ? "w-6 bg-amber" : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — view larger, like a photo gallery. Portalled to <body> so
          it escapes the page-transition transform and covers the full viewport. */}
      {lightbox &&
        mounted &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 sm:p-10 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} — diagram ${index + 1} of ${count}`}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-xl text-paper transition-colors duration-300 ease-calm hover:text-amber"
          >
            ✕
          </button>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous diagram"
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/20 text-2xl text-paper transition-colors duration-300 ease-calm hover:text-amber sm:left-8"
            >
              ‹
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[92vw] rounded-xl bg-paper object-contain shadow-2xl"
          />

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next diagram"
              className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/20 text-2xl text-paper transition-colors duration-300 ease-calm hover:text-amber sm:right-8"
            >
              ›
            </button>
          )}

          <p className="absolute inset-x-0 bottom-6 mx-auto max-w-2xl px-6 text-center text-small text-paper/80">
            <span className="text-paper">{current.title}</span> — {current.caption}
          </p>
        </div>,
          document.body,
        )}
    </div>
  );
}
