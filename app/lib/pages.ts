import type { Metadata } from "next";
import { getCanonicalUrl } from "./canonical";

/** Shared metadata builder for content pages, with sensible fallbacks. */
export async function pageMetadata({
  path,
  title,
  description,
  image,
}: {
  path: string;
  title: string;
  description: string;
  image?: string | null;
}): Promise<Metadata> {
  const url = await getCanonicalUrl();
  const desc = description.length > 160 ? `${description.slice(0, 157).trimEnd()}…` : description;
  return {
    title,
    description: desc,
    alternates: url ? { canonical: `${url}${path}` } : undefined,
    openGraph: {
      type: "article",
      title: `${title} | SiliconMotives`,
      description: desc,
      ...(url ? { url: `${url}${path}` } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { title: `${title} | SiliconMotives`, description: desc, ...(image ? { images: [image] } : {}) },
  };
}

/** Split plain text into paragraphs on blank lines. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
