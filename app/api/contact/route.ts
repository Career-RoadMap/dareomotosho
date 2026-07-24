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

  const res = await sendInquiry(apiKey, subject, html, replyTo);

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend contact relay failed:", res.status, detail);
    return NextResponse.json(
      { error: "Send failed", detail: `Resend ${res.status}: ${detail.slice(0, 300)}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}

function sendInquiry(
  apiKey: string,
  subject: string,
  html: string,
  replyTo: string | null,
) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Distinct from the results@ sender so inquiries are easy to filter;
      // RESEND_CONTACT_FROM overrides (must be on the verified domain).
      from:
        process.env.RESEND_CONTACT_FROM ??
        "Website inquiries <contacts@email.dareomotosho.com>",
      to: ["dare@dareomotosho.com"],
      subject,
      html,
      // Reply-To as a raw header: portable across Resend's field-name
      // variants (reply_to vs replyTo).
      ...(replyTo ? { headers: { "Reply-To": replyTo } } : {}),
    }),
  });
}

/**
 * Diagnostic: GET /api/contact?send=test fires a real test inquiry to the
 * inbox and reports Resend's exact response; a plain GET only reports the
 * configuration without sending.
 */
export async function GET(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_CONTACT_FROM ??
    "Website inquiries <contacts@email.dareomotosho.com>";
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      reason: "RESEND_API_KEY is not set in this environment.",
    });
  }
  if (request.nextUrl.searchParams.get("send") !== "test") {
    return NextResponse.json({
      ok: true,
      configured: true,
      from,
      hint: "Add ?send=test to send a test inquiry and see Resend's raw response.",
    });
  }
  const res = await sendInquiry(
    apiKey,
    "Contact form self-test",
    "<p>Test inquiry from /api/contact?send=test. If you are reading this in the inbox, the contact relay works.</p>",
    "dare@dareomotosho.com",
  );
  const detail = await res.text().catch(() => "");
  return NextResponse.json({
    ok: res.ok,
    resendStatus: res.status,
    resendResponse: detail.slice(0, 500),
    from,
  });
}
