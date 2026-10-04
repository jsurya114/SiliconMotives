import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";
import type { Database } from "./database.types";

/**
 * Service-role client. SERVER ONLY: it bypasses row-level security, so it is
 * used solely in API routes that validate input themselves (public forms).
 * Never import this from a client component.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (typeof window !== "undefined") throw new Error("service client is server-only");
  if (!supabaseUrl || !key) return null;
  return createClient<Database>(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
