import { siteUrl } from "@/lib/site";

/**
 * Short share links: dareomotosho.com/go/<code>
 *
 * The problem this solves. A tracked link is unreadable when it is shared:
 *
 *   https://dareomotosho.com/resources/field-kit?utm_source=youtube
 *     &utm_medium=short&utm_campaign=cost-own-2026w33
 *     &utm_content=spark-the-wrong-question          → 147 characters
 *   https://dareomotosho.com/go/w33                  → 31
 *
 * The codes live on this domain rather than a third-party shortener, which
 * matters more than the neatness: a bit.ly or lnkd.in link puts a company
 * between the viewer and the site, can be rate-limited or blocked, dies if
 * that company does, and leaks the click to them. These redirect from the
 * same origin as the destination, and the UTM parameters are still attached
 * on arrival — so analytics sees exactly what it saw before. Only the shared
 * string gets shorter.
 *
 * Adding one is a single entry below. The defaults cover the common case (a
 * YouTube short pointing at the Field Kit shelf), so most entries are two
 * lines.
 *
 * Codes are matched case-insensitively, because these get retyped by hand out
 * of video descriptions.
 */

export type ShortLink = {
  /** The /go/<code> segment. Keep it short, lowercase, and unambiguous. */
  code: string;
  /** Destination path on this site. Defaults to the Field Kit shelf. */
  to?: string;
  /** utm_campaign — the episode or push this link belongs to. */
  campaign: string;
  /** utm_content — which specific asset was clicked. */
  content?: string;
  /** utm_source. Defaults to "youtube". */
  source?: string;
  /** utm_medium. Defaults to "short". */
  medium?: string;
  /** A note for whoever reads this file later. Never rendered. */
  note?: string;
};

const DEFAULT_TO = "/resources/field-kit";
const DEFAULT_SOURCE = "youtube";
const DEFAULT_MEDIUM = "short";

/**
 * Every short link the site answers to.
 *
 * Do NOT delete or repoint a code once it has shipped in a video description.
 * Those descriptions are edited rarely and screenshotted often; a code is
 * effectively permanent from the moment it is published, exactly like
 * /resources/field-kit itself. Add a new code instead.
 */
export const shortLinks: ShortLink[] = [
  {
    code: "w33",
    campaign: "cost-own-2026w33",
    content: "spark-the-wrong-question",
    note: "Cloud cost is an org chart problem — the YouTube short.",
  },
  {
    code: "w33li",
    campaign: "cost-own-2026w33",
    content: "empathy",
    source: "linkedin",
    medium: "post",
    note: "Same campaign, the LinkedIn post. Replaces a buff.ly link that Buffer generated automatically and that times out on some networks.",
  },
];

/**
 * Naming: <episode-tag> for the YouTube short, plus a platform suffix for
 * anything else in the same campaign (w33 → w33li). Keep them lowercase and
 * short enough to retype from a description without a typo.
 *
 * If a scheduler is in the loop — Buffer, Hootsuite, Later — turn its own
 * link shortening OFF before posting. Otherwise it rewrites these into its
 * own domain, and the whole point of owning the redirect is lost.
 */

/** Look-up table, lowercased once at module load. */
const byCode = new Map(shortLinks.map((l) => [l.code.toLowerCase(), l]));

/**
 * The full, tracked destination for a code, or null when the code is unknown.
 * Absolute, because a redirect Location header should not be ambiguous.
 */
export function resolveShortLink(rawCode: string): string | null {
  const link = byCode.get(rawCode.trim().toLowerCase());
  if (!link) return null;

  const url = new URL(link.to ?? DEFAULT_TO, siteUrl);
  url.searchParams.set("utm_source", link.source ?? DEFAULT_SOURCE);
  url.searchParams.set("utm_medium", link.medium ?? DEFAULT_MEDIUM);
  url.searchParams.set("utm_campaign", link.campaign);
  if (link.content) url.searchParams.set("utm_content", link.content);
  return url.toString();
}

/** Where an unrecognised code lands. Never a 404 — see the route handler. */
export function shortLinkFallback(): string {
  const url = new URL(DEFAULT_TO, siteUrl);
  // Tagged so a mistyped or retired code is visible in analytics rather than
  // looking like ordinary direct traffic.
  url.searchParams.set("utm_source", "shortlink");
  url.searchParams.set("utm_medium", "redirect");
  url.searchParams.set("utm_campaign", "unknown-code");
  return url.toString();
}
