import { NextResponse, type NextRequest } from "next/server";
import { getResource } from "@/lib/resources";
import { buildResourcePdf } from "@/lib/resource-pdf";
import { UNLOCK_COOKIE } from "@/lib/resource-gate";

// @react-pdf/renderer needs the Node runtime, not edge.
export const runtime = "nodejs";

/**
 * The kit as a printable PDF. Gated by the same one-time unlock cookie as
 * the content API, so the sheet cannot be pulled without leaving an email
 * once — and a reader who has already unlocked gets it in one click, here
 * and on every future kit.
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

  const pdf = await buildResourcePdf(resource);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resource.slug}.pdf"`,
      // Private: this is gated content, never shared-cacheable.
      "Cache-Control": "private, no-store",
    },
  });
}
