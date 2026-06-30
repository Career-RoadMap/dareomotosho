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
 * Crucially, content renders VISIBLE and aligned by default (in the SSR HTML
 * and on first paint). Only elements that are below the fold at load are
 * hidden — off-screen, so there's no flash — and then eased in on scroll.
 * That keeps the first impression of every page clean and aligned while the
 * motion still plays as you scroll. Honors prefers-reduced-motion.
 */
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
    if (typeof IntersectionObserver === "undefined") return; // stays visible
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Defer the layout read (getBoundingClientRect forces a synchronous
    // reflow) to the next frame. On navigation a page mounts many Reveals at
    // once; doing this off the commit's critical path keeps that work out of
    // the long task that the interaction is waiting on, which lowers INP. The
    // measured element is off-screen until shown, so there's no visible flash.
    let observer: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      const vh = window.innerHeight || 0;
      // Already in (or near) view at load → leave visible; never scatter on entry.
      if (node.getBoundingClientRect().top < vh * 0.92) return;

      // Below the fold → hide (off-screen) and reveal on scroll.
      setHidden(true);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setHidden(false);
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
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
