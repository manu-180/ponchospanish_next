import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { siteUrl } from "@/lib/seo/config";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

// Re-generate hourly so newly published Academy courses appear without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const SITE_LAUNCHED = new Date("2026-06-01");

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/ondemand`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/legal/terms`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Published Academy courses (read with a cookieless anon client so the
  // sitemap stays statically generatable / ISR-cached rather than dynamic).
  try {
    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } },
    );
    const { data } = await supabase
      .from("courses")
      .select("slug, updated_at")
      .eq("is_published", true);

    for (const course of data ?? []) {
      routes.push({
        url: `${siteUrl}/ondemand/${course.slug}`,
        lastModified: course.updated_at ? new Date(course.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    const { data: products } = await supabase
      .from("digital_products")
      .select("slug, updated_at")
      .eq("is_published", true);

    for (const product of products ?? []) {
      routes.push({
        url: `${siteUrl}/ondemand/ebooks/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Supabase unreachable during build/revalidate — ship static routes only.
  }

  return routes;
}
