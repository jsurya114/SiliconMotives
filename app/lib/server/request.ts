import { createHash } from "crypto";

/**
 * Client IP for rate limiting. A forwarding header is trusted only when we
 * know a proxy we control sets it; otherwise clients could spoof it per
 * request and bypass the limit.
 *  - TRUSTED_IP_HEADER (e.g. "cf-connecting-ip" behind Cloudflare) wins.
 *  - On Vercel (VERCEL=1), the platform overwrites x-real-ip and
 *    x-forwarded-for with the real client IP.
 *  - Otherwise only the last X-Forwarded-For hop (appended by the nearest
 *    proxy) is used; earlier entries are client-controlled.
 */
export function clientIp(request: Request) {
  const h = request.headers;
  const first = (value: string | null) => value?.split(",")[0]?.trim() || null;

  const configured = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  if (configured) {
    const ip = first(h.get(configured));
    if (ip) return ip;
  }
  if (process.env.VERCEL) {
    const ip = first(h.get("x-real-ip")) || first(h.get("x-forwarded-for"));
    if (ip) return ip;
  }
  const chain = h
    .get("x-forwarded-for")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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
