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
      { href: "/resources#community", label: "Community Questions" },
      { href: "/resources#course-questions", label: "Interview Prep" },
    ],
  },
  { href: "/speaking", label: "Speaking" },
  { href: "/advisory", label: "Advisory" },
  { href: "/about", label: "About" },
];

/** Primary contact email, shown for general inquiries and booking. */
export const contactEmail = "dare@dareomotosho.com";

/** Contact email for privacy-specific requests (Privacy + Cookie policies). */
export const privacyEmail = "privacy@dareomotosho.com";

/**
 * FormSubmit alias for {@link contactEmail}, issued after activating
 * dare@dareomotosho.com there. Using the alias instead of the naked address
 * keeps the email out of the client bundle. Regenerate at formsubmit.co if
 * it ever changes.
 */
export const formSubmitAlias = "749a1f153340c16fa905dca455bfce34";

export const social = {
  youtube: "https://www.youtube.com/@DareOmotosho",
  x: "https://x.com/your-handle",
  linkedin: "https://www.linkedin.com/in/dare-omotosho-lekan-cloud-oxla/",
} as const;
