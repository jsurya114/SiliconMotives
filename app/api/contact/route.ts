import { NextResponse } from "next/server";
import { createServiceClient } from "@/app/lib/supabase/service";
import { clientIp, escapeHtml, hashIp, isEmail } from "@/app/lib/server/request";
import { sendEmail, sendWhatsApp } from "@/app/lib/server/notify";

const WINDOW_MINUTES = 15;
const MAX_PER_WINDOW = 5;

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const message = typeof data?.message === "string" ? data.message.trim() : "";
  const service =
    typeof data?.service === "string" ? data.service.trim().slice(0, 50) : "";
  if (
    !name ||
    name.length > 100 ||
    !isEmail(email) ||
    message.length < 10 ||
    message.length > 2000
  ) {
    return NextResponse.json(
      { message: "Please provide a name, valid email, and project description." },
      { status: 400 },
    );
  }

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json(
      { message: "The contact service is temporarily unavailable." },
      { status: 503 },
    );
  }

  // Per-visitor rate limit (hashed IP), so one sender can't block everyone.
  const ipHash = hashIp(clientIp(request));
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { message: "Too many enquiries. Please try again shortly." },
      { status: 429 },
    );
  }

  const { error } = await db
    .from("contact_submissions")
    .insert({ name, email, message, service, ip_hash: ipHash });
  if (error) {
    console.error("Contact insert failed:", error.message);
    return NextResponse.json({ message: "Unable to submit enquiry." }, { status: 502 });
  }

  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  await Promise.allSettled([
    sendEmail(
      `New enquiry from ${name.slice(0, 60)} — SiliconMotives`,
      `<h2>New contact form submission</h2>
       <p><strong>Name:</strong> ${escapeHtml(name)}</p>
       <p><strong>Email:</strong> ${escapeHtml(email)}</p>
       <p><strong>Service:</strong> ${escapeHtml(service || "Not specified")}</p>
       <p><strong>Message:</strong></p>
       <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
       <hr/><p style="color:#888;font-size:12px">Submitted ${submittedAt} IST</p>`,
    ),
    sendWhatsApp(
      `📩 New enquiry: ${name}\n📧 ${email}\n💼 ${service || "N/A"}\n\n${message.slice(0, 200)}`,
    ),
  ]).then((results) =>
    results.forEach((r) => {
      if (r.status === "rejected") console.error("Notification failed:", r.reason);
    }),
  );

  return NextResponse.json({ message: "Enquiry received." });
}
