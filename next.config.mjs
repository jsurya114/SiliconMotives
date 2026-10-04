/** @type {import('next').NextConfig} */
// Allow images from the configured Supabase Storage (any protocol/host/port,
// so local `supabase start` and custom domains work), else *.supabase.co.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;
const supabasePattern = supabase
  ? {
      protocol: supabase.protocol.replace(":", ""),
      hostname: supabase.hostname,
      ...(supabase.port ? { port: supabase.port } : {}),
      pathname: "/storage/v1/object/public/**",
    }
  : { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" };

const nextConfig = {
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage (public "media" bucket)
      supabasePattern,
      // Images uploaded before the Supabase migration remain on Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/*/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
