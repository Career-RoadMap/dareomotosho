"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";

/**
 * FAQ accordion. Functional page, answers fade in on expand, no decorative
 * motion. Built on native disclosure semantics for accessibility.
 */
export default function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <span className="font-serif text-h2 font-light text-ink">
                {item.question}
              </span>
              <span
                className={`mt-1 shrink-0 text-link transition-transform duration-300 ease-calm ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-calm ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose pb-6 text-body text-ink">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
