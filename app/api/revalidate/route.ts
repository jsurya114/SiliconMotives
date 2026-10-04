import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from "@/app/lib/supabase/env";
import type { Database } from "@/app/lib/supabase/database.types";

/**
 * Refresh cached public pages after an admin edits content, so changes are
 * visible immediately instead of after the 60-second ISR window.
 * Only signed-in admins may call this.
 */
export async function POST() {
  if (!supabaseConfigured) return NextResponse.json({ ok: false }, { status: 503 });
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) return NextResponse.json({ ok: false }, { status: 403 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
