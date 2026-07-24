import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/** Escape a string for safe inclusion in the HTML email body. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Contact / inquiry relay: delivers form submissions to Dare's inbox via
 * Resend. Accepts a subject plus arbitrary named fields; the submitter's
 * email becomes reply-to.
 * The honeypot field is accepted and silently discarded so bots can't tell
 * they were caught.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form is not configured" },
      { status: 503 },
    );
  }

  let body: { subject?: string; fields?: Record<string, unknown>; honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bot filled the invisible field: pretend success, deliver nothing.
  if (body.honeypot) {
    return NextResponse.json({ success: true });
  }

  const subject = (body.subject ?? "New inquiry from the website")
    .toString()
    .slice(0, 150);

  const entries = Object.entries(body.fields ?? {})
    .filter(([, v]) => typeof v === "string" && v.trim())
    .map(([k, v]) => [k.slice(0, 60), (v as string).trim().slice(0, 5000)]);
  if (entries.length === 0) {
    return NextResponse.json({ error: "Empty submission" }, { status: 400 });
  }

  const fromEntry = entries.find(([k]) => k.toLowerCase() === "email")?.[1] ?? "";
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEntry) ? fromEntry : null;

  const rows = entries
    .map(
      ([k, v]) => `<tr>
        <td style="padding:8px 14px;border:1px solid #e5e5e5;background:#f8f8f8;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:capitalize;color:#1e3a5f;vertical-align:top;white-space:nowrap">${esc(k)}</td>
        <td style="padding:8px 14px;border:1px solid #e5e5e5;font-family:Georgia,serif;font-size:14px;color:#0f1b2d;white-space:pre-wrap">${esc(v)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#f7f5f0">
  <div style="max-width:600px;margin:0 auto">
    <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b8842e;margin:0 0 12px">${esc(subject)}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#fff">${rows}</table>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#999;margin:14px 0 0">Sent from the dareomotosho.com contact form.</p>
  </div>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM ??
        "Website inquiries <results@email.dareomotosho.com>",
      to: ["dare@dareomotosho.com"],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend contact relay failed:", res.status, detail);
    return NextResponse.json(
      { error: "Send failed", detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
