import { NextResponse, type NextRequest } from "next/server";
import { getResource } from "@/lib/resources";
import { UNLOCK_COOKIE } from "@/lib/resource-gate";

export const runtime = "nodejs";

/**
 * The gated half of a resource page. The page itself serves only the
 * preview; the full markdown body comes from here, and only to a browser
 * carrying the unlock cookie (set once, after the reader leaves an email —
 * see components/ResourceUnlock.tsx). Crawlers and cold visitors get 401,
 * which keeps the gated body out of the indexable page while the preview
 * and metadata stay fully crawlable.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (request.cookies.get(UNLOCK_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Locked" }, { status: 401 });
  }
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Only the remainder: the page already renders the preview publicly, and
  // the two halves reassemble into the full document.
  return NextResponse.json({ body: resource.gated });
}
