"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/site";

/**
 * Header: name on the left, the build-first nav inline on the web (desktop),
 * collapsing to a quiet three-line disclosure on mobile. Ink on Paper; links
 * shift to Blue-lift on hover with a gentle underline draw.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Let Escape close the mobile menu — a quiet, expected courtesy.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-md">
      <div className="container-content flex items-center justify-between gap-6 py-4">
        {/* Name only */}
        <Link href="/" className="group flex items-center leading-none" aria-label="Home">
          <span className="font-serif text-xl font-medium tracking-tight text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
            {brand.name}
          </span>
        </Link>

        {/* Desktop nav — inline titles. */}
        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-7">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`link-quiet text-small ${
                      active ? "text-signature" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile three-line toggle. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors duration-300 ease-calm hover:text-blue-lift"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ease-calm ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-300 ease-calm ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ease-calm ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile nav — slow eased disclosure. */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={`lg:hidden grid overflow-hidden border-t border-ink/5 transition-[grid-template-rows,opacity] duration-500 ease-calm ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="container-content flex flex-col gap-1 py-4">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? undefined : -1}
                    className={`block rounded-md px-3 py-2.5 text-body transition-colors duration-300 ease-calm hover:bg-ink/[0.03] hover:text-blue-lift ${
                      active ? "text-signature" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
