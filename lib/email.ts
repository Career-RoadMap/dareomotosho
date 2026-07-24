/** Bare address: user@host.tld with no spaces or angle brackets. */
const ADDR = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/**
 * Normalize a sender from an env var into a form Resend accepts
 * (`email@example.com` or `Name <email@example.com>`). Env values pasted
 * with wrapping quotes, stray whitespace, or a missing display-name format
 * are repaired; anything unusable falls back to the given default so a
 * misconfigured variable degrades to the safe sender instead of a 422.
 */
export function safeSender(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  const v = raw.trim().replace(/^['"]+|['"]+$/g, "").trim();
  if (ADDR.test(v)) return v;
  const named = v.match(/^(.*)<\s*([^<>\s]+@[^<>\s]+\.[^<>\s]+)\s*>$/);
  if (named) {
    const name = named[1].trim().replace(/^['"]+|['"]+$/g, "").trim();
    return name ? `${name} <${named[2]}>` : named[2];
  }
  // Last resort: pull the first bare address out of the string.
  const bare = v.match(/[^\s@<>'"]+@[^\s@<>'"]+\.[^\s@<>'"]+/);
  return bare ? bare[0] : fallback;
}
