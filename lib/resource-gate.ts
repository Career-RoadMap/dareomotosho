/**
 * The one-time unlock token for episode resources, shared between the
 * client gate (components/ResourceUnlock.tsx) and the content API
 * (app/api/resources/[slug]/route.ts).
 *
 * The rule the token exists to protect: email is asked for ONCE, ever —
 * not once per resource. First unlock stores the token in BOTH
 * localStorage (survives cookie clears) and a cookie (what the content
 * API checks); each mirrors the other back, so a returning reader never
 * hits the wall twice.
 */
export const UNLOCK_COOKIE = "resources_unlocked";
export const UNLOCK_STORAGE_KEY = "resources:unlocked";

/** One year, in seconds. */
export const UNLOCK_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * The cookie as written from the browser. `Secure` keeps it off plaintext
 * connections, and `SameSite=Lax` keeps it off cross-site requests while still
 * surviving a normal link into the site.
 *
 * This is a convenience token, NOT an authorisation check: the kits are free,
 * and anyone willing to set a cookie by hand can read them without leaving an
 * address. The gate exists to ask politely once, so it is deliberately not
 * built as a security boundary — nothing behind it is private.
 *
 * Chrome, Firefox and Safari all treat http://localhost as a secure context,
 * so `Secure` does not break local development.
 */
export const UNLOCK_COOKIE_ATTRS = `path=/; max-age=${UNLOCK_MAX_AGE}; SameSite=Lax; Secure`;
