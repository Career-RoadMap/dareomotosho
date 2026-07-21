"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Corner = "tl" | "tr" | "bl" | "br";

const offset: Record<Corner, string> = {
  tl: "-translate-x-24 -translate-y-20",
  tr: "translate-x-24 -translate-y-20",
  bl: "-translate-x-24 translate-y-20",
  br: "translate-x-24 translate-y-20",
};

/**
 * Entrance wrapper for a grid of tiles that "come together" once scrolled to.
 * Each tile starts offset toward its corner and eases into place, fires once.
 * The translate lives on this outer wrapper so it never fights a flip/3D
 * transform on the child.
 *
 * Visibility is driven by a single shared IntersectionObserver (no per-element
 * getBoundingClientRect), so a grid of these doesn't force synchronous layout
 * on mount. Visible (aligned) by default so first paint never scatters; only
 * below-fold tiles hide and animate in. Honors prefers-reduced-motion.
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
          rec.primed = true;
          if (entry.isIntersecting) {
            observer!.unobserve(entry.target);
            registry.delete(entry.target);
          } else {
            rec.onHide();
          }
        } else if (entry.isIntersecting) {
          rec.onShow();
          observer!.unobserve(entry.target);
          registry.delete(entry.target);
        }
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  return observer;
}

export default function Converge({
  children,
  from = "tl",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  from?: Corner;
  /** Stagger delay in ms so tiles arrive one after another, visibly. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = getObserver();
    if (!obs) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registry.set(node, {
      primed: false,
      onHide: () => setVisible(false),
      onShow: () => setVisible(true),
    });
    obs.observe(node);
    return () => {
      obs.unobserve(node);
      registry.delete(node);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`h-full transition-all duration-[800ms] ease-calm ${
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `scale-95 opacity-0 ${offset[from]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
