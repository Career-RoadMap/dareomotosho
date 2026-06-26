"use client";

/**
 * template.tsx re-mounts on every navigation, so wrapping children here gives
 * a smooth eased dissolve between pages — never a hard cut.
 * The animation is curtailed under prefers-reduced-motion (see globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
