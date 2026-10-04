"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { getBrowserClient } from "@/app/lib/supabase/browser";
import { supabaseConfigured } from "@/app/lib/supabase/env";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin/login";

  // Middleware enforces admin access server-side; this mirrors the session
  // client-side so an expired session returns to the login screen.
  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = getBrowserClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (signedIn === false && !isLoginPage) router.replace("/admin/login");
  }, [signedIn, isLoginPage, router]);

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white p-6">
        <div className="max-w-md bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-navy">Supabase is not configured</h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the
            environment (see SUPABASE.md), then restart the app.
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-warm-white">{children}</div>;
  }

  if (!signedIn) return null;

  return (
    <div className="min-h-screen bg-warm-gray50">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-heading font-bold text-navy capitalize">
            {pathname.split("/").pop() === "admin" ? "Dashboard" : pathname.split("/").pop()?.replace("-", " ")}
          </h1>
        </header>
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
