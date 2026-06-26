"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/site";

/**
 * Header: logo + Tier-1 byline near it. The nav stays quietly hidden behind a
 * three-line toggle in the top corner at every width, and is exposed on click
 * as a calm, slow disclosure panel. Ink on Paper; links shift to Blue-lift on
 * hover with a gentle underline draw.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Let Escape close the menu — a quiet, expected courtesy.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-md">
      <div className="container-content flex items-center justify-between gap-6 py-4">
        {/* Logo + byline */}
        <Link href="/" className="group flex flex-col leading-none" aria-label="Home">
          <span className="font-serif text-xl font-medium tracking-tight text-ink transition-colors duration-300 ease-calm group-hover:text-blue-lift">
            {brand.name}
          </span>
          <span className="kicker mt-1.5 text-[0.66rem] text-ink/55">{brand.byline}</span>
        </Link>

        {/* Three-line toggle — the nav lives here at every width. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors duration-300 ease-calm hover:text-blue-lift"
          aria-expanded={open}
          aria-controls="primary-nav"
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

      {/* Disclosure panel — slow eased reveal, never a hard cut. */}
      <nav
        id="primary-nav"
        aria-label="Primary"
        className={`overflow-hidden border-t border-ink/5 transition-[grid-template-rows,opacity] duration-500 ease-calm grid ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="container-content flex flex-col gap-1 py-6 sm:py-8">
            {nav.map((item, i) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? undefined : -1}
                    className={`group flex items-baseline gap-4 rounded-md px-3 py-3 transition-colors duration-300 ease-calm hover:bg-ink/[0.03] ${
                      active ? "text-signature" : "text-ink/80 hover:text-blue-lift"
                    }`}
                  >
                    <span className="kicker w-6 shrink-0 text-ink/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Nav is UI text — Inter, per the locked type system (G4.1). */}
                    <span className="text-xl font-medium tracking-tight">
                      {item.label}
                    </span>
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
