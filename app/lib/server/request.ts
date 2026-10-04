import { createHash } from "crypto";

/**
 * Client IP for rate limiting. Prefer headers set by the hosting proxy, which
 * clients cannot forge; only fall back to the LAST X-Forwarded-For entry (the
 * one appended by the nearest proxy). The first entry is client-controlled.
 */
export function clientIp(request: Request) {
  const h = request.headers;
  const trusted = h.get("x-vercel-forwarded-for") || h.get("x-real-ip");
  if (trusted) return trusted.split(",")[0].trim();
  const chain = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return chain?.length ? chain[chain.length - 1] : "unknown";
}

/**
 * Salted hash so raw visitor IPs are never stored. The salt must be secret:
 * IPv4 space is small enough to brute-force an unsalted or known-salt hash.
 * Falls back to the (secret) service-role key when IP_HASH_SALT is unset.
 */
export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!salt) throw new Error("IP_HASH_SALT or SUPABASE_SERVICE_ROLE_KEY must be set");
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
