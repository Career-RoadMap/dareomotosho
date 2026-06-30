"use client";

import { useEffect, useRef, useState } from "react";

type TierBackdropProps = {
  src: string;
  /** Which side the motif anchors to. */
  align?: "left" | "right";
};

/**
 * A subtle section backdrop that fades in as the tier is reached and drifts
 * slightly slower than the page as you scroll (gentle parallax), understated
 * depth that reinforces the section's message, never a loud billboard.
 *
 * Kept very low opacity so warm Paper still dominates and the strict palette
 * holds. Honors prefers-reduced-motion: it still fades in, but doesn't drift.
 */
export default function TierBackdrop({ src, align = "right" }: TierBackdropProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setVisible(true);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(node);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return () => io.disconnect();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when the section's top hits the viewport bottom, 1 when it leaves the top.
        const progress = (vh - rect.top) / (vh + rect.height);
        // Gentle drift: ~±48px across the whole pass.
        setOffset((progress - 0.5) * 96);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-[1200ms] ease-calm ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        className={`absolute top-1/2 h-[130%] w-auto max-w-none -translate-y-1/2 opacity-[0.07] [will-change:transform] ${
          align === "right" ? "right-0" : "left-0"
        }`}
      />
    </div>
  );
}
