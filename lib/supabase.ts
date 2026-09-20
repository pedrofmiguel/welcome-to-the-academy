import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client, holding the service_role key.
 *
 * This key bypasses row-level security, so it must never be imported
 * into a client component. The "server-only" import above turns that
 * mistake into a build error rather than a leak.
 *
 * The characters table has RLS on with no policies, so this is the only
 * way anything reaches it — players' browsers hold no Supabase
 * credentials at all and talk to our own /api/characters instead.
 */

let cached: SupabaseClient | null = null;

export function isConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "in .env.local (locally) or in the Vercel project's environment variables."
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
