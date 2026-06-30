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

/**
 * Per-page banner images. Each page opens on a full-bleed banner.
 * These are on-brand PLACEHOLDERS living in /public/banners, drop the real
 * artwork in over the matching file (keep the name, or update the path here
 * if the extension differs, e.g. "/banners/home.jpg").
 */
export const pageBanners = {
  home: "/banners/home.svg",
  work: "/banners/work.svg",
  resources: "/banners/resources.svg",
  speaking: "/banners/speaking.svg",
  advisory: "/banners/advisory.svg",
  about: "/banners/about.svg",
  learn: "/banners/learn.svg",
} as const;

/** Landing-page banner image. */
export const bannerSrc = pageBanners.home;

/** About-page portrait placeholder, drop the real photo in over this file. */
export const aboutPortrait = "/portraits/dare.svg";

export type NavItem = {
  href: string;
  label: string;
  /** Optional dropdown children (one level of nesting supported). */
  children?: NavItem[];
};

/** NAV order is intentional, a "build-first ascent." Do not reorder casually. */
export const nav: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/start-here", label: "Learn" },
  {
    href: "/resources",
    label: "Resources",
    children: [
      { href: "/resources#case-studies", label: "Case Studies" },
      {
        href: "/resources#community",
        label: "Community Questions",
        children: [
          { href: "/resources#faqs", label: "FAQs" },
          { href: "/resources#course-questions", label: "Interview Prep" },
        ],
      },
    ],
  },
  { href: "/speaking", label: "Speaking" },
  { href: "/advisory", label: "Advisory" },
  { href: "/about", label: "About" },
];

/** Where booking + inquiry form submissions are delivered. */
export const contactEmail = "darelekan46@gmail.com";

/**
 * FormSubmit alias for {@link contactEmail}. Using the alias instead of the
 * naked address keeps the email out of the client bundle (less scraping/spam).
 * Issued by FormSubmit on activation; regenerate it there if it ever changes.
 */
export const formSubmitAlias = "1875ebb7d8771afd337e8fc5cd8ee770";

export const social = {
  youtube: "https://www.youtube.com/@DareOmotosho",
  x: "https://x.com/your-handle",
  linkedin: "https://www.linkedin.com/in/dare-omotosho-lekan-cloud-oxla/",
} as const;
