import { NextResponse, type NextRequest } from "next/server";
import { trackById, temperamentFromCode } from "@/lib/pathfinder";
import { buildReportPdf } from "@/lib/report-pdf";
import { siteUrl } from "@/lib/site";

// @react-pdf/renderer needs the Node runtime, not edge.
export const runtime = "nodejs";

/**
 * Email the Path Finder result via Resend, with the full report attached as
 * a PDF. Requires RESEND_API_KEY in the environment; RESEND_FROM optionally
 * overrides the sender (must be a Resend-verified domain).
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email delivery is not configured" },
      { status: 503 },
    );
  }

  let body: { email?: string; track?: string; t?: string; pacing?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const track = trackById(body.track ?? "");
  if (!track) {
    return NextResponse.json({ error: "Unknown track" }, { status: 400 });
  }

  const temperament = body.t ? temperamentFromCode(body.t) : null;
  const pacing =
    typeof body.pacing === "string" && body.pacing
      ? body.pacing.slice(0, 300)
      : null;

  const pdf = await buildReportPdf(track, temperament, pacing);
  const resultUrl = `${siteUrl}/path-finder/${track.id}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:Georgia,serif;color:#0f1b2d;background:#f7f5f0;margin:0;padding:32px 16px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 28px">
    <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b8842e">Cloud Career Path Report</div>
    <h1 style="font-size:1.7rem;font-weight:400;line-height:1.2;margin:10px 0 6px">${track.title}</h1>
    <p style="font-size:1rem;color:#555;font-style:italic;margin:0">${track.tagline}</p>
    ${
      temperament
        ? `<p style="margin:16px 0 0;font-size:.95rem;color:#1e3a5f"><strong>Temperament:</strong> ${temperament.code} · ${temperament.family.name}</p>`
        : ""
    }
    <p style="margin:20px 0 0;font-size:.95rem;color:#444">Your full report — roadmap, salary reference, certifications, first project, and reading list — is attached as a PDF.</p>
    <p style="margin:24px 0 0">
      <a href="${resultUrl}" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,sans-serif;font-size:.9rem;font-weight:600">View your result online →</a>
    </p>
    <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:.72rem;color:#999;line-height:1.6">Educational reference only. Not professional, career, or financial advice.<br/>Sent because you requested your result at dareomotosho.com/path-finder.</p>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Dare Omotosho <results@dareomotosho.com>",
      to: [email],
      bcc: ["dare@dareomotosho.com"],
      subject: `Your cloud career path: ${track.title}`,
      html,
      attachments: [
        {
          filename: `cloud-career-path-${track.id}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend send failed:", res.status, detail);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
