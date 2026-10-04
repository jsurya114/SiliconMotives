import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "./lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — Web Design & Web App Development, Kochi`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#111111",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
