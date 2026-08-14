import { NextResponse, type NextRequest } from "next/server";
import { resolveShortLink, shortLinkFallback } from "@/lib/links";

export const runtime = "nodejs";

/**
 * /go/<code> — the short share links (lib/links.ts).
 *
 * 307, not 301. A 301 is cached by browsers more or less forever, so getting a
 * destination wrong once would follow a visitor around with no way to correct
 * it from here. These links point at marketing destinations that may need
 * repointing, so the redirect stays temporary on purpose.
 *
 * An unknown code redirects to the Field Kit shelf rather than 404ing. These
 * codes are printed in video descriptions that are rarely edited and often
 * screenshotted, so a typo — theirs or ours — must still land somewhere
 * useful. The fallback is UTM-tagged as `unknown-code` so it shows up in
 * analytics instead of hiding among direct traffic.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const destination = resolveShortLink(code) ?? shortLinkFallback();

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      // Browsers re-ask every time so a repointed code takes effect at once;
      // the CDN absorbs a burst if a video lands well.
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=60",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
