import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Add a subscriber to the Resend audience. Requires RESEND_API_KEY and
 * RESEND_AUDIENCE_ID (the audience's ID from the Resend dashboard) in the
 * environment. An already-subscribed address counts as success.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "Subscriptions are not configured" },
      { status: 503 },
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    },
  );

  // 409 = contact already exists, which is still "you're on the list".
  if (res.ok || res.status === 409) {
    return NextResponse.json({ success: true });
  }

  const detail = await res.text().catch(() => "");
  console.error("Resend contact create failed:", res.status, detail);
  return NextResponse.json(
    { error: "Subscribe failed", detail: detail.slice(0, 300) },
    { status: 502 },
  );
}
