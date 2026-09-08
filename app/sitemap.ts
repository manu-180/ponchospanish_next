import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo/config";
import { getSitemapCatalog, type SitemapCatalogEntry } from "@/lib/seo/public-catalog";

export const revalidate = 3600;

function catalogEntries(entries: SitemapCatalogEntry[], prefix: string): MetadataRoute.Sitemap {
  return entries.filter((entry) => entry.slug.trim()).map((entry) => {
    const modified = new Date(entry.updated_at);
    return {
      url: absolute(`${prefix}/${encodeURIComponent(entry.slug)}`),
      ...(Number.isNaN(modified.getTime()) ? {} : { lastModified: modified }),
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courses, products } = await getSitemapCatalog();
  const paths = [
    "/",
    "/ondemand",
    "/spanish-lessons",
    "/spanish-lessons/children",
    "/spanish-lessons/gcse",
    "/spanish-lessons/home-education",
    "/spanish-lessons/adults",
    "/legal/terms",
  ];
  return [
    ...paths.map((path) => ({ url: absolute(path) })),
    ...catalogEntries(courses, "/ondemand"),
    ...catalogEntries(products, "/ondemand/ebooks"),
  ];
}
