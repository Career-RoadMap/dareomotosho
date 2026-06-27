"use client";

import { useState } from "react";
import CountUp from "./CountUp";

type FlipCardProps = {
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  /** Hero proof gets the deep Signature Blue surface. */
  hero?: boolean;
};

/** Split a metric into number + suffix for an optional dignified count-up. */
function parseMetric(metric: string): { num: number; suffix: string } | null {
  const match = metric.match(/^(\d+)(\D*)$/);
  if (!match) return null;
  return { num: Number(match[1]), suffix: match[2] };
}

/**
 * Featured case card. The front shows only the heading + metric; a calm,
 * eased click flip reveals the detail on the back. Keyboard-operable (it is a
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

  const faceBase =
    "absolute inset-0 flex flex-col rounded-3xl p-8 sm:p-12 [backface-visibility:hidden]";
  const surface = hero
    ? "bg-signature text-paper"
    : "border border-ink/10 bg-paper text-ink";

  return (
    <div className="h-full [perspective:1800px]">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${title} — ${flipped ? "hide" : "show"} detail`}
        className="group relative block h-full min-h-[20rem] w-full text-left transition-transform duration-700 ease-calm [transform-style:preserve-3d] sm:min-h-[18rem]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front — heading only. */}
        <span className={`${faceBase} ${surface}`}>
          <span className={`kicker ${hero ? "text-amber" : "text-blue-lift"}`}>
            {hero ? "Hero proof" : "Outcome"}
          </span>
          <span
            className={`mt-5 font-serif font-light leading-none ${
              hero ? "text-paper text-display" : "text-signature text-h1"
            }`}
          >
            {parsed ? <CountUp value={parsed.num} suffix={parsed.suffix} /> : metric}
          </span>
          <span
            className={`mt-3 text-small ${hero ? "text-paper/65" : "text-ink/55"}`}
          >
            {metricLabel}
          </span>
          <span
            className={`mt-auto pt-8 font-serif text-h2 font-light leading-tight ${
              hero ? "text-paper" : "text-ink"
            }`}
          >
            {title}
          </span>
          <span className="mt-6 inline-flex items-center gap-2 text-small text-amber">
            Read the story
            <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
              ↻
            </span>
          </span>
        </span>

        {/* Back — the detail, revealed on flip. */}
        <span
          className={`${faceBase} ${surface} justify-between [transform:rotateY(180deg)]`}
        >
          <span
            className={`font-serif text-xl font-light leading-tight ${
              hero ? "text-paper" : "text-signature"
            }`}
          >
            {title}
          </span>
          <span
            className={`mt-4 flex-1 overflow-y-auto text-small leading-relaxed ${
              hero ? "text-paper/85" : "text-ink"
            }`}
          >
            {body}
          </span>
          <span className="mt-6 inline-flex items-center gap-2 text-small text-amber">
            Back
            <span className="transition-transform duration-300 ease-calm group-hover:-translate-x-1">
              ↺
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
