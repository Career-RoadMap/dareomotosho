"use client";

import { useState } from "react";
import CountUp from "./CountUp";

type FlipCardProps = {
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  /** Hero proof gets the deep Signature Blue front surface. */
  hero?: boolean;
};

/** Split a metric into number + suffix for an optional dignified count-up. */
function parseMetric(metric: string): { num: number; suffix: string } | null {
  const match = metric.match(/^(\d+)(\D*)$/);
  if (!match) return null;
  return { num: Number(match[1]), suffix: match[2] };
}

/**
 * Featured case card. The front shows only the heading + metric, centered; a
 * calm, eased click flip reveals the detail on a SOLID-color back. Hovering
 * (before any click) rings the card in amber. Keyboard-operable (it is a
 * button); the flip is curtailed to an instant under prefers-reduced-motion.
 */
export default function FlipCard({
  metric,
  metricLabel,
  title,
  body,
  hero = false,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const parsed = parseMetric(metric);

  // Both faces: centered content, clipped to the rounded border so nothing
  // ever spills past the box.
  const faceBase =
    "absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl p-8 text-center [backface-visibility:hidden]";
  const frontSurface = hero
    ? "bg-signature text-paper"
    : "border border-ink/10 bg-paper text-ink";
  // Flipped side is a solid fill (no border), distinct from the front.
  const backSurface = hero ? "bg-ink text-paper" : "bg-signature text-paper";

  return (
    <div className="group h-full rounded-3xl transition-shadow duration-300 ease-calm [perspective:1800px] hover:ring-2 hover:ring-amber">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${title} — ${flipped ? "hide" : "show"} detail`}
        className="relative block h-full min-h-[24rem] w-full transition-transform duration-700 ease-calm [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front — heading only, centered. */}
        <span className={`${faceBase} ${frontSurface}`}>
          {!hero && <span className="kicker text-blue-lift">Outcome</span>}
          <span
            className={`font-serif font-light leading-none ${
              hero ? "text-paper text-display" : "text-signature text-h1"
            }`}
          >
            {parsed ? <CountUp value={parsed.num} suffix={parsed.suffix} /> : metric}
          </span>
          <span className={`text-small ${hero ? "text-paper/65" : "text-ink/55"}`}>
            {metricLabel}
          </span>
          <span
            className={`mt-1 max-w-[24rem] font-serif text-xl font-light leading-tight ${
              hero ? "text-paper" : "text-ink"
            }`}
          >
            {title}
          </span>
          <span className="mt-1 inline-flex items-center gap-2 text-small text-amber">
            Read the story
            <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
              ↻
            </span>
          </span>
        </span>

        {/* Back — solid color, the detail centered. */}
        <span className={`${faceBase} ${backSurface} [transform:rotateY(180deg)]`}>
          <span className="max-w-[24rem] font-serif text-xl font-light leading-tight text-paper">
            {title}
          </span>
          <span className="max-w-[34rem] text-small leading-relaxed text-paper/85">
            {body}
          </span>
          <span className="mt-1 inline-flex items-center gap-2 text-small text-amber">
            Back
            <span>↺</span>
          </span>
        </span>
      </button>
    </div>
  );
}
