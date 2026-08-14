import { NextResponse } from "next/server";
import { shortLinkFallback } from "@/lib/links";

export const runtime = "nodejs";

/** /go with no code. Same reasoning as an unknown code: land, do not 404. */
export async function GET() {
  return NextResponse.redirect(shortLinkFallback(), {
    status: 307,
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=60",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
