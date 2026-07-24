import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Add a subscriber to the Resend audience. Requires RESEND_API_KEY. The
 * audience is discovered automatically from the account (first audience,
 * i.e. the default "General" one); RESEND_AUDIENCE_ID optionally pins a
 * specific audience, and a wrong value falls back to discovery instead of
 * failing. An already-subscribed address counts as success.
 */

// Cached across requests within a warm serverless instance.
let cachedAudienceId: string | null = null;

async function firstAudienceId(apiKey: string): Promise<string | null> {
  const res = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as {
    data?: { id?: string }[];
  } | null;
  return data?.data?.[0]?.id ?? null;
}

function addContact(apiKey: string, audienceId: string, email: string) {
  return fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
}

/**
 * Diagnostic: GET /api/subscribe reports whether the Resend audience wiring
 * works, without exposing secrets. Open it in a browser to see why contacts
 * are not landing (e.g. a restricted sending-only API key).
 */
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      reason: "RESEND_API_KEY is not set in this environment.",
    });
  }
  const res = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json({
      ok: false,
      reason: `Resend refused the audiences request (HTTP ${res.status}). ` +
        "This usually means the API key has 'Sending access' only — " +
        "create a key with Full access in Resend → API Keys and update " +
        "RESEND_API_KEY.",
      detail: detail.slice(0, 300),
    });
  }
  const data = (await res.json().catch(() => null)) as {
    data?: { id?: string; name?: string }[];
  } | null;
  const audiences = (data?.data ?? []).map((a) => ({ id: a.id, name: a.name }));
  return NextResponse.json({
    ok: audiences.length > 0,
    audiences,
    using:
      process.env.RESEND_AUDIENCE_ID ??
      audiences[0]?.id ??
      "none — create an audience in Resend",
    override: Boolean(process.env.RESEND_AUDIENCE_ID),
  });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
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

  // Candidate audiences, in order: the one that already worked, an explicit
  // override, then whatever the account actually has.
  const candidates: string[] = [];
  if (cachedAudienceId) {
    candidates.push(cachedAudienceId);
  } else {
    if (process.env.RESEND_AUDIENCE_ID) {
      candidates.push(process.env.RESEND_AUDIENCE_ID);
    }
    const discovered = await firstAudienceId(apiKey);
    if (discovered && !candidates.includes(discovered)) {
      candidates.push(discovered);
    }
  }

  let lastStatus = 0;
  let lastDetail = "";
  for (const audienceId of candidates) {
    const res = await addContact(apiKey, audienceId, email);
    // 409 = contact already exists, which is still "you're on the list".
    if (res.ok || res.status === 409) {
      cachedAudienceId = audienceId;
      return NextResponse.json({ success: true });
    }
    lastStatus = res.status;
    lastDetail = await res.text().catch(() => "");
    // A stale cached ID shouldn't poison future requests.
    if (audienceId === cachedAudienceId) cachedAudienceId = null;
  }

  console.error("Resend contact create failed:", lastStatus, lastDetail);
  return NextResponse.json(
    {
      error: candidates.length
        ? "Subscribe failed"
        : "No Resend audience found on the account",
      detail: lastDetail.slice(0, 300),
    },
    { status: 502 },
  );
}
