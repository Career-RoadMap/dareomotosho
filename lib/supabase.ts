import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client, shared by server reads and client realtime.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. When those
 * aren't set, `supabase` is null and the library falls back to local seed
 * data, so the site still builds and runs with no backend. The anon key is
 * safe in the browser; row-level security (see supabase/migrations) is what
 * actually gates writes and unpublished rows.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      realtime: { params: { eventsPerSecond: 5 } },
    })
  : null;
