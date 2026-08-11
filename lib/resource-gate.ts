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
