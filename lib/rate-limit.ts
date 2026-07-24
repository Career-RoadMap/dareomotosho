/**
 * Minimal fixed-window rate limiter for the email-sending API routes.
 * In-memory, so the window is per serverless instance — best-effort, but it
 * stops the realistic abuse case (a burst loop against one warm instance)
 * without adding a dependency or external store.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

/** True if this call is allowed; false once `limit` calls have been made
 *  under `key` within the current window. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Client IP for rate-limit keys (first hop of x-forwarded-for on Vercel). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
