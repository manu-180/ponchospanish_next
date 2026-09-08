import type { MetadataRoute } from "next";
import { absolute, isIndexableDeployment } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    ...(isIndexableDeployment ? { sitemap: absolute("/sitemap.xml") } : {}),
  };
}
