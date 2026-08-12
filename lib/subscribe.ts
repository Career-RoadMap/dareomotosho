import { supabase } from "@/lib/supabase";

/**
 * The one client-side path onto the email list, shared by the Subscribe form
 * (components/EmailCapture) and the Field Kit gate (components/ResourceUnlock)
 * so the two can never drift.
 *
 * The address goes to two places: the Resend audience via /api/subscribe, and
 * the Supabase `subscribers` table as the backup list. Either landing counts —
 * the address is on the list.
 *
 * The point of this module is the SECOND return value. Both stores already
 * refuse duplicates (`subscribers_email_unique` on `lower(email)` in
 * supabase/migrations/0001_schema.sql; a Resend contact conflict), so a repeat
 * signup has never created a duplicate row. What was missing is that both
 * callers threw the refusal away and reported plain success — so a returning
 * subscriber got no acknowledgement that they were already on the list, and
 * the gate sent them the welcome email a second time. `alreadySubscribed`
 * carries that fact back to the UI.
 */

export type SubscribeResult = {
  /** The address is on the list (newly added, or already there). */
  ok: boolean;
  /**
   * The address was already on the list, so nothing was added and no
   * welcome mail should be sent. False when we could not tell — never a
   * guess, so the caller's default is to behave as if this is a new signup.
   */
  alreadySubscribed: boolean;
};

/**
 * Lowercased and trimmed. The Supabase unique index is on `lower(email)`, so
 * normalising here keeps Resend's contact list agreeing with it instead of
 * carrying You@x.com and you@x.com as two contacts.
 */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function submitEmail(
  rawEmail: string,
  source: string,
): Promise<SubscribeResult> {
  const email = normalizeEmail(rawEmail);

  const [resend, supa] = await Promise.all([
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        if (!res.ok) return { ok: false, already: false };
        const data = (await res.json().catch(() => null)) as {
          alreadySubscribed?: boolean;
        } | null;
        return { ok: true, already: data?.alreadySubscribed === true };
      })
      .catch(() => ({ ok: false, already: false })),

    // The backup list. 23505 is the unique-index violation, which is not a
    // failure — it is the definitive "this address is already on the list",
    // and the more reliable of the two signals.
    supabase
      ? supabase
          .from("subscribers")
          .insert({ email, source })
          .then(({ error }) => {
            if (!error) return { ok: true, already: false };
            if (error.code === "23505") return { ok: true, already: true };
            return { ok: false, already: false };
          })
      : Promise.resolve({ ok: false, already: false }),
  ]);

  return {
    ok: resend.ok || supa.ok,
    alreadySubscribed: resend.already || supa.already,
  };
}
