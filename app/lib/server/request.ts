import { createHash } from "crypto";

/** Client IP from the proxy headers set by the host (e.g. Vercel). */
export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Salted hash so raw visitor IPs are never stored. */
export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "siliconmotives";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
