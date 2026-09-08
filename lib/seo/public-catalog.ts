import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Database } from "@/types/database";

export type SitemapCatalogEntry = { slug: string; updated_at: string };

export const getSitemapCatalog = unstable_cache(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Sitemap requires the public Supabase URL and anonymous key");
  }

  const client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });

  async function published(table: "courses" | "digital_products") {
    const entries: SitemapCatalogEntry[] = [];
    let cursor: string | undefined;
    while (true) {
      let query = client.from(table)
        .select("slug, updated_at")
        .eq("is_published", true)
        .order("slug", { ascending: true })
        .limit(500);
      if (cursor) query = query.gt("slug", cursor);
      const { data, error } = await query;
      if (error) throw new Error(`Sitemap ${table} query failed (${error.code})`);
      const page = data ?? [];
      entries.push(...page);
      if (page.length < 500) return entries;
      cursor = page[page.length - 1].slug;
    }
  }

  const [courses, products] = await Promise.all([
    published("courses"),
    published("digital_products"),
  ]);
  return { courses, products };
}, ["seo-published-sitemap-catalog"], { revalidate: 3600 });
