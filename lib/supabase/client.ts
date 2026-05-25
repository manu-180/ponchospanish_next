"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export type PonchoClient = ReturnType<typeof createBrowserClient<Database>>;

let _client: PonchoClient | null = null;

export function getSupabaseBrowserClient(): PonchoClient {
  if (_client) return _client;
  _client = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return _client;
}
