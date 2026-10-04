import { NextResponse } from "next/server";
import { createServiceClient } from "@/app/lib/supabase/service";
import { clientIp, escapeHtml, hashIp } from "@/app/lib/server/request";
import { sendEmail } from "@/app/lib/server/notify";

const WINDOW_HOURS = 1;
const MAX_PER_WINDOW = 3;

/** Public testimonial submission; stored as "pending" until an admin approves it. */
export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const role = typeof data?.role === "string" ? data.role.trim() : "";
  const quote = typeof data?.quote === "string" ? data.quote.trim() : "";
  const rating = Number(data?.rating);
  if (
    name.length < 2 ||
    name.length > 100 ||
    role.length < 2 ||
    role.length > 150 ||
    quote.length < 20 ||
    quote.length > 1000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      {
        message:
          "Please add your name, role or company, a rating, and a review of at least 20 characters.",
      },
      { status: 400 },
    );
  }

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json(
      { message: "Submissions are temporarily unavailable." },
      { status: 503 },
    );
  }

  const ipHash = hashIp(clientIp(request));
  const since = new Date(Date.now() - WINDOW_HOURS * 3_600_000).toISOString();
  const { count } = await db
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  const { error } = await db
    .from("testimonials")
    .insert({ name, role, quote, rating, status: "pending", ip_hash: ipHash });
  if (error) {
    console.error("Testimonial insert failed:", error.message);
    return NextResponse.json({ message: "Unable to submit your review." }, { status: 502 });
  }

  sendEmail(
    `New testimonial from ${name.slice(0, 60)} — awaiting review`,
    `<p><strong>${escapeHtml(name)}</strong>, ${escapeHtml(role)} (${rating}/5)</p>
     <p style="white-space:pre-wrap">${escapeHtml(quote)}</p>
     <p>Approve it in the admin panel under Testimonials.</p>`,
  ).catch((e) => console.error("Testimonial email failed:", e));

  return NextResponse.json({
    message: "Thank you! Your testimonial has been submitted for review.",
  });
}
