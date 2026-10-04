import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => null);
    if (
      !data ||
      typeof data.name !== "string" ||
      !data.name.trim() ||
      data.name.length > 100 ||
      typeof data.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      data.email.length > 254 ||
      typeof data.message !== "string" ||
      data.message.trim().length < 10 ||
      data.message.length > 2000
    ) {
      return NextResponse.json(
        {
          message:
            "Please provide a name, valid email, and project description.",
        },
        { status: 400 },
      );
    }
    const api =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5001";
    const response = await fetch(`${api.replace(/\/$/, "")}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        service:
          typeof data.service === "string" ? data.service.slice(0, 50) : "",
        phone: "",
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok)
      return NextResponse.json(
        { message: "Unable to submit enquiry." },
        { status: response.status === 429 ? 429 : 502 },
      );
    return NextResponse.json({ message: "Enquiry received." });
  } catch {
    return NextResponse.json(
      { message: "The contact service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
