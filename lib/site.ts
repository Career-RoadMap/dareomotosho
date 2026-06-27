/**
 * Site-wide configuration: brand strings + navigation.
 * Kept in one place so nav order and byline never drift between header/footer.
 */

export const brand = {
  name: "Dare Omotosho",
  byline: "Builder · Mentor · Boardroom Translator",
  oneLine:
    "A translator between the technical floor and the boardroom, who builds the systems that connect them.",
} as const;

export type NavItem = {
  href: string;
  label: string;
};

/** NAV order is intentional — a "build-first ascent." Do not reorder casually. */
export const nav: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/start-here", label: "Start Here" },
  { href: "/resources", label: "Resources" },
  { href: "/live", label: "Live" },
  { href: "/speaking", label: "Speaking" },
  { href: "/advisory", label: "Advisory" },
  { href: "/about", label: "About" },
];

export const social = {
  youtube: "https://youtube.com/@your-channel",
  x: "https://x.com/your-handle",
  linkedin: "https://linkedin.com/in/your-handle",
} as const;
