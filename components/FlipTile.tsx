"use client";

import { useState } from "react";

type FlipTileProps = {
  title: string;
  body: string;
};

/**
 * Capability tile. The front shows only the heading, centered; a calm, eased
 * click flip reveals the explanation on a SOLID Signature Blue back. Hovering
 * (before any click) rings the tile in amber. Keyboard-operable (it is a
 * button); the flip is curtailed to an instant under prefers-reduced-motion.
 */
export default function FlipTile({ title, body }: FlipTileProps) {
  const [flipped, setFlipped] = useState(false);

  const faceBase =
    "absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl p-8 text-center [backface-visibility:hidden]";

  return (
    <div className="group h-full rounded-3xl transition-shadow duration-300 ease-calm [perspective:1600px] hover:ring-2 hover:ring-amber">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${title}, ${flipped ? "hide" : "show"} detail`}
        className="relative block h-full min-h-[15rem] w-full transition-transform duration-700 ease-calm [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front, heading only. */}
        <span className={`${faceBase} border border-ink/10 bg-paper text-ink`}>
          <span className="max-w-[20rem] font-serif text-xl font-medium leading-tight text-ink">
            {title}
          </span>
          <span className="inline-flex items-center gap-2 text-small text-amber">
            Read more
            <span className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
              ↻
            </span>
          </span>
        </span>

        {/* Back, solid Signature Blue, the explanation centered. */}
        <span
          className={`${faceBase} bg-signature text-paper [transform:rotateY(180deg)]`}
        >
          <span className="text-small leading-relaxed text-paper/90">{body}</span>
          <span className="inline-flex items-center gap-2 text-small text-amber">
            Back
            <span>↺</span>
          </span>
        </span>
      </button>
    </div>
  );
}
