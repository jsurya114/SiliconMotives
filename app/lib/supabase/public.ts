import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from "./env";
import type { Database } from "./database.types";

/**
 * Anonymous, session-less client for server components that read published
 * content. Row-level security limits it to public data.
 */
export function createPublicClient(revalidate = 60) {
  if (!supabaseConfigured) return null;
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Let Next.js cache public reads (ISR) and bound slow responses.
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.timeout(4000),
          next: { revalidate },
        } as RequestInit),
    },
  });
}
