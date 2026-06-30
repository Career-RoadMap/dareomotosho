"use client";

import { useState } from "react";
import type { BioLength } from "@/lib/content";

/**
 * Bio in three lengths, embed-short / medium / press-long.
 * A quiet toggle; the chosen bio fades in. Warm page, gentle motion only.
 */
export default function BioLengths({ bios }: { bios: BioLength[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {bios.map((bio, i) => {
          const isActive = i === active;
          return (
            <button
              key={bio.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-1.5 text-small transition-colors duration-300 ease-calm ${
                isActive
                  ? "border-amber bg-amber text-ink"
                  : "border-ink/15 text-ink hover:border-blue-lift hover:text-blue-lift"
              }`}
            >
              {bio.label}
            </button>
          );
        })}
      </div>

      <p
        key={active}
        className="mt-8 max-w-prose text-body text-ink animate-fade-in"
      >
        {bios[active].text}
      </p>
    </div>
  );
}
