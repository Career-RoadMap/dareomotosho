"use client";

import { useEffect, useState } from "react";

export type DotSection = { id: string; label: string };

/**
 * Right-edge dot navigation that turns a long page into "scrolling pages":
 * one dot per section, the active one stretched amber, click to glide there.
 * Tracks the section nearest the viewport centre via IntersectionObserver.
 * Desktop only (hidden below lg) and invisible to printers.
 */
export default function SectionDots({ sections }: { sections: DotSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A slim horizontal band around the viewport centre decides "current".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block print:hidden"
    >
      <ul className="flex flex-col items-center gap-3">
        {sections.map((s) => {
          const current = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={current ? "true" : undefined}
                title={s.label}
                className={`block rounded-full transition-all duration-300 ease-calm ${
                  current
                    ? "h-7 w-2.5 bg-amber"
                    : "h-2.5 w-2.5 bg-ink/25 hover:bg-blue-lift"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
