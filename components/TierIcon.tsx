"use client";

import { useEffect, useRef, useState } from "react";

export type TierIconName = "systems" | "people";

/**
 * A quiet line mark that sits beside a tier heading and says, at a glance,
 * what the tier is about. Replaces the old full-bleed parallax backdrop:
 * one small, sharp object reads cleaner than a large, faint image behind
 * the text.
 *
 * Motion is deliberately understated. The strokes draw themselves once as
 * the tier is reached, and the badge lifts fractionally on hover.
 *
 * The resting state is FULLY DRAWN, so the mark is correct in the SSR HTML,
 * with JavaScript off, and under prefers-reduced-motion. Only a mark that is
 * still below the fold at mount gets un-drawn and then animated, which is
 * the same rule Reveal follows, so nothing already on screen re-animates.
 */
export default function TierIcon({
  name,
  className = "",
}: {
  name: TierIconName;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      // Already in view at load: leave it drawn rather than replaying.
      if (node.getBoundingClientRect().top < (window.innerHeight || 0) * 0.92) return;
      setDrawing(true);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add("is-drawn");
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`tier-icon ${drawing ? "is-drawing" : ""} inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber/40 bg-amber/[0.10] text-signature sm:h-16 sm:w-16 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 sm:h-8 sm:w-8"
      >
        {name === "systems" ? (
          <>
            {/* Stacked platform layers: the foundation everything stands on. */}
            <path className="tier-stroke" d="M12 3.4 20.5 7.6 12 11.8 3.5 7.6 12 3.4Z" />
            <path className="tier-stroke tier-stroke-2" d="M3.5 12.1 12 16.3l8.5-4.2" />
            <path className="tier-stroke tier-stroke-3" d="M3.5 16.5 12 20.7l8.5-4.2" />
          </>
        ) : (
          <>
            {/* Two figures: the people side, and delivery led at scale. */}
            <circle className="tier-stroke" cx="9.2" cy="8" r="3.1" />
            <path className="tier-stroke tier-stroke-2" d="M3.6 19.4a5.6 5.6 0 0 1 11.2 0" />
            <path
              className="tier-stroke tier-stroke-3"
              d="M16.4 5.4a3.1 3.1 0 0 1 0 5.9M17.6 14.6a5.6 5.6 0 0 1 3 4.8"
            />
          </>
        )}
      </svg>
    </span>
  );
}
