import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Poncho Spanish — Online Spanish Lessons for Kids & Teens",
    short_name: "Poncho Spanish",
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#F2F0E9",
    theme_color: "#F2F0E9",
    lang: siteConfig.language,
    categories: ["education", "kids"],
    icons: [
      { src: "/icon", sizes: "any", type: "image/png", purpose: "any" },
      {
        src: "/images/logo.png",
        sizes: "220x70",
        type: "image/png",
      },
    ],
  };
}
