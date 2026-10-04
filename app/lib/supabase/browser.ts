"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | undefined;

/** Browser client for the admin panel; the session lives in cookies. */
export function getBrowserClient() {
  client ??= createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}
