import { type NextRequest } from "next/server";
import { trackById, temperamentFromCode } from "@/lib/pathfinder";
import { buildReportPdf } from "@/lib/report-pdf";

// @react-pdf/renderer needs the Node runtime, not edge.
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get("track") ?? "";
  const tCode = request.nextUrl.searchParams.get("t") ?? "";
  const pacingRaw = request.nextUrl.searchParams.get("pacing") ?? "";

  const track = trackById(trackId);
  if (!track) return new Response("Track not found", { status: 404 });

  const pdf = await buildReportPdf(
    track,
    tCode ? temperamentFromCode(tCode) : null,
    pacingRaw ? pacingRaw.slice(0, 300) : null,
  );

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cloud-career-path-${track.id}.pdf"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
