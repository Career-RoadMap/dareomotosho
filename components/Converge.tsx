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
 * transform on the child. Honors prefers-reduced-motion (shows at rest).
 */
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
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
