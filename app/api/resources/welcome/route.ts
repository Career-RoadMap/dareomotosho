import { NextResponse, type NextRequest } from "next/server";
import { safeSender } from "@/lib/email";
import { clientIp, rateLimit, releaseRateLimit } from "@/lib/rate-limit";
import { getResource } from "@/lib/resources";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";

/**
 * The confirmation a reader gets after unlocking their first Field Kit:
 * it tells them what they just signed up for and links back to the kit
 * they opened and to the full shelf, so the email is a way back in rather
 * than a receipt.
 *
 * Subscription itself happens in /api/subscribe (same Resend audience as
 * the site's Subscribe form). This route only sends the note, so a failure
 * here can never cost the reader their unlock — the caller ignores the
 * result.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email delivery is not configured" },
      { status: 503 },
    );
  }

  if (!rateLimit(`kit-welcome:${clientIp(request.headers)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // A second cap, keyed on the ADDRESS rather than the caller. The client
  // already skips this route for an address that was already on the list, but
  // this route is unauthenticated — anyone can POST any address — so without a
  // per-address cap the same person could be mailed repeatedly from rotating
  // IPs. One note per address per day makes "you are not emailed twice" a
  // property of the server, not a promise the client keeps.
  //
  // The limiter is in-memory, so on serverless this holds per warm instance
  // rather than globally. That is enough for the realistic case and is why the
  // client-side skip stays as the first line of defence rather than the only
  // one.
  // Claimed before the send, so two concurrent requests cannot both through;
  // released again below if the send fails, so one transient Resend error does
  // not cost the reader their email for a day.
  const perAddress = `kit-welcome-to:${email}`;
  if (!rateLimit(perAddress, 1, 24 * 60 * 60 * 1000)) {
    // Not an error from the reader's point of view: they already have it.
    return NextResponse.json({ success: true, skipped: "already-sent" });
  }

  // The kit they just opened, when we can identify it: the mail links
  // straight back to it as well as to the shelf.
  const resource = body.slug ? await getResource(body.slug) : null;
  const shelfUrl = `${siteUrl}/resources/field-kit`;

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:Georgia,serif;color:#0f1b2d;background:#f7f5f0;margin:0;padding:32px 16px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 28px">
    <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b8842e">The Field Kit</div>
    <h1 style="font-size:1.6rem;font-weight:400;line-height:1.25;margin:10px 0 8px">Your kits are open.</h1>
    <p style="margin:0;font-size:1rem;color:#444">
      Thanks for leaving your email. Every Field Kit on the site is now unlocked
      in your browser, including the ones from future episodes, and you will not
      be asked again.
    </p>
    ${
      resource
        ? `<p style="margin:20px 0 0;font-size:.95rem;color:#444">
             You opened <strong>${resource.title}</strong> &mdash;
             <em>&ldquo;${resource.takeaway}&rdquo;</em>
           </p>
           <p style="margin:16px 0 0">
             <a href="${siteUrl}/resources/${resource.slug}" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-family:Arial,sans-serif;font-size:.88rem;font-weight:600">Open that kit again &rarr;</a>
           </p>`
        : ""
    }
    <p style="margin:24px 0 0;font-size:.95rem;color:#444">Every kit lives here:</p>
    <p style="margin:10px 0 0">
      <a href="${shelfUrl}" style="display:inline-block;background:#e0a951;color:#0f1b2d;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,sans-serif;font-size:.9rem;font-weight:600">Browse The Field Kit &rarr;</a>
    </p>
    <p style="margin:26px 0 0;font-family:Arial,sans-serif;font-size:.72rem;color:#999;line-height:1.6">
      One tool per episode, free to use. You are on the same list as the site's
      newsletter, and every email has an unsubscribe link.
    </p>
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
      from: safeSender(
        process.env.RESEND_FROM,
        "Dare Omotosho <results@email.dareomotosho.com>",
      ),
      to: [email],
      subject: resource
        ? `Your Field Kit: ${resource.title}`
        : "Your Field Kit is open",
      html,
      headers: { "Reply-To": "dare@dareomotosho.com" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Field Kit welcome email failed:", res.status, detail);
    // Nothing was delivered, so do not hold the day's allowance for it.
    releaseRateLimit(perAddress);
    return NextResponse.json(
      { error: "Send failed", detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
