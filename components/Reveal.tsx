"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Scroll-reveal: content gently fades up as it's reached, once.
 *
 * Content renders VISIBLE and aligned by default (SSR + first paint). A single
 * shared IntersectionObserver then decides, off the main thread, which elements
 * sit below the fold — those (and only those) are hidden and eased in on scroll.
 * Using the observer's own report instead of a per-element getBoundingClientRect
 * avoids forced synchronous layout, so navigating to a reveal-heavy page no
 * longer thrashes layout (keeps interaction latency / INP low). Honors
 * prefers-reduced-motion.
 */

type Rec = { primed: boolean; onHide: () => void; onShow: () => void };

let observer: IntersectionObserver | null = null;
const registry = new WeakMap<Element, Rec>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const rec = registry.get(entry.target);
        if (!rec) continue;
        if (!rec.primed) {
          // First report: in view at load → stay visible; below fold → hide.
          rec.primed = true;
          if (entry.isIntersecting) {
            observer!.unobserve(entry.target);
            registry.delete(entry.target);
          } else {
            rec.onHide();
          }
        } else if (entry.isIntersecting) {
          // Scrolled into view → reveal, once.
          rec.onShow();
          observer!.unobserve(entry.target);
          registry.delete(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = getObserver();
    if (!obs) return; // no IO support → stays visible
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registry.set(node, {
      primed: false,
      onHide: () => setHidden(true),
      onShow: () => setHidden(false),
    });
    obs.observe(node);
    return () => {
      obs.unobserve(node);
      registry.delete(node);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-calm ${
        hidden ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
