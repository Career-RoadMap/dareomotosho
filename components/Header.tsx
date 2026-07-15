"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav, type NavItem } from "@/lib/site";

/**
 * Header: name on the left, the build-first nav inline on the web (desktop),
 * collapsing to a quiet three-line disclosure on mobile. Ink on Paper; links
 * shift to amber on hover. Items with children (Resources) open a hover/focus
 * dropdown on desktop and expand inline on mobile.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Hides the hover/focus dropdown the moment a child link is clicked, the
  // CSS group-hover/focus-within rules would otherwise keep it open across
  // the client-side navigation. Re-arms when the pointer leaves the menu.
  const [dropdownSuppressed, setDropdownSuppressed] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Let Escape close the mobile menu, a quiet, expected courtesy.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-md print:hidden">
      <div className="container-content flex items-center justify-between gap-6 py-4">
        {/* Name only */}
        <Link href="/" className="group flex items-center leading-none" aria-label="Home">
          <span className="font-serif text-xl font-medium tracking-tight text-ink transition-colors duration-300 ease-calm group-hover:text-amber">
            {brand.name}
          </span>
        </Link>

        {/* Desktop nav, inline titles, with hover/focus dropdowns. */}
        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-7">
            {nav.map((item) => {
              const active = isActive(item.href);
              if (item.cta) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="inline-flex items-center justify-center rounded-lg bg-amber px-5 py-2.5 text-small font-medium tracking-wide text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97] active:brightness-95"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`link-amber text-small ${
                        active ? "text-signature" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={item.href}
                  className="group/nav relative"
                  onMouseLeave={() => setDropdownSuppressed(false)}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup="true"
                    className={`link-amber inline-flex items-center gap-1.5 text-small ${
                      active ? "text-signature" : "text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      className="block h-3 w-3 text-ink/40 transition-transform duration-300 ease-calm group-hover/nav:rotate-180"
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>

                  {/* Dropdown panel, opens on hover or keyboard focus; force-
                      hidden right after a child click so it doesn't linger. */}
                  <div
                    className={
                      dropdownSuppressed
                        ? "invisible absolute right-0 top-full pt-3 opacity-0"
                        : "invisible absolute right-0 top-full pt-3 opacity-0 transition-all duration-200 ease-calm group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100"
                    }
                  >
                    <ul className="w-60 overflow-hidden rounded-2xl border border-ink/10 bg-paper p-2 shadow-xl shadow-ink/10">
                      {item.children.map((child) => (
                        <DropdownItem
                          key={child.href}
                          item={child}
                          onNavigate={() => setDropdownSuppressed(true)}
                        />
                      ))}
                    </ul>
                  </div>
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

      {/* Mobile nav, slow eased disclosure, children indented inline. */}
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
              if (item.cta) {
                return (
                  <li key={item.href} className="px-3 pt-2">
                    <Link
                      href={item.href}
                      tabIndex={open ? undefined : -1}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-amber px-5 py-3 text-body font-medium text-ink shadow-sm transition-all duration-300 ease-calm hover:brightness-[0.97]"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? undefined : -1}
                    className={`block rounded-md px-3 py-2.5 text-body transition-colors duration-300 ease-calm hover:bg-ink/[0.03] hover:text-amber ${
                      active ? "text-signature" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="ml-3 border-l border-ink/10 pl-3">
                      {item.children.map((child) => (
                        <MobileChild
                          key={child.href}
                          item={child}
                          open={open}
                        />
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}

/**
 * A dropdown/menu link that opens in a new tab for `external` items (static
 * tools outside the app router) and uses client-side Link otherwise.
 */
function NavChildLink({
  item,
  className,
  tabIndex,
  onNavigate,
}: {
  item: NavItem;
  className: string;
  tabIndex?: number;
  onNavigate?: () => void;
}) {
  // Drop focus (so focus-within stops holding the dropdown open) and let the
  // header hide the panel for the rest of this hover session.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur();
    onNavigate?.();
  };
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        tabIndex={tabIndex}
        onClick={handleClick}
        className={className}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} tabIndex={tabIndex} onClick={handleClick} className={className}>
      {item.label}
    </Link>
  );
}

/** A desktop dropdown row, renders a nested submenu when the item has children. */
function DropdownItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  if (!item.children) {
    return (
      <li>
        <NavChildLink
          item={item}
          onNavigate={onNavigate}
          className="block rounded-xl px-3 py-2.5 text-small text-ink transition-colors duration-200 ease-calm hover:bg-ink/[0.04] hover:text-amber"
        />
      </li>
    );
  }
  return (
    <li>
      <Link
        href={item.href}
        onClick={(e) => {
          e.currentTarget.blur();
          onNavigate?.();
        }}
        className="block rounded-xl px-3 pt-2.5 pb-1 text-small font-medium text-signature transition-colors duration-200 ease-calm hover:text-amber"
      >
        {item.label}
      </Link>
      <ul className="ml-3 border-l border-ink/10 pl-2">
        {item.children.map((child) => (
          <li key={child.href}>
            <NavChildLink
              item={child}
              onNavigate={onNavigate}
              className="block rounded-xl px-3 py-2 text-small text-ink/80 transition-colors duration-200 ease-calm hover:bg-ink/[0.04] hover:text-amber"
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

/** A mobile child row, supports one nested level (Community Questions). */
function MobileChild({ item, open }: { item: NavItem; open: boolean }) {
  return (
    <li>
      <NavChildLink
        item={item}
        tabIndex={open ? undefined : -1}
        className="block rounded-md px-3 py-2 text-small text-ink/80 transition-colors duration-300 ease-calm hover:bg-ink/[0.03] hover:text-amber"
      />
      {item.children ? (
        <ul className="ml-3 border-l border-ink/10 pl-3">
          {item.children.map((child) => (
            <li key={child.href}>
              <NavChildLink
                item={child}
                tabIndex={open ? undefined : -1}
                className="block rounded-md px-3 py-1.5 text-small text-ink/65 transition-colors duration-300 ease-calm hover:bg-ink/[0.03] hover:text-amber"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
