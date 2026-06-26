"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/site";

/**
 * Header: logo + Tier-1 byline near it, then the build-first nav.
 * Ink on Paper; nav links shift to Blue-lift on hover with a gentle underline.
 * Mobile collapses to a quiet disclosure menu.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

        {/* Desktop nav */}
        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-7">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`link-quiet text-small ${
                      active ? "text-signature" : "text-ink/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
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

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={`lg:hidden overflow-hidden border-t border-ink/5 transition-[max-height,opacity] duration-500 ease-calm ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-content flex flex-col gap-1 py-4">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-md px-3 py-2.5 text-body transition-colors duration-300 ease-calm hover:bg-ink/[0.03] hover:text-blue-lift ${
                    active ? "text-signature" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
