import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database, Profile } from "@/types/database";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/** Server Component / Route Handler / Server Action — respects user session via cookies. */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* Called from a Server Component — set ignored.
             * Middleware will refresh the session token. */
          }
        },
      },
    },
  );
}

/**
 * Cookieless public/anon client for STATIC + ISR reads of PUBLIC data (e.g. the
 * published course catalog). Because it reads NO cookies, pages that use it can
 * be statically rendered / ISR-cached instead of being forced dynamic. RLS
 * still applies under the anon role, so only public rows are returned.
 *
 * Do NOT use for anything user-specific — it has no session.
 */
let _publicClient: ReturnType<typeof createClient<Database>> | null = null;
export function getSupabasePublicClient() {
  if (_publicClient) return _publicClient;
  _publicClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  return _publicClient;
}

/**
 * Admin client (service role). NEVER expose to client. Use only inside
 * server actions / route handlers where you've already authorised the request.
 */
export function getSupabaseAdminClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  // 1. Validate the session using cookies (impossible to forge — the cookie
  //    is signed by Supabase).
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  // 2. Read the profile via the admin client (service role) to bypass RLS.
  //    This is safe because:
  //      a) The user.id came from a verified session.
  //      b) We only read the row matching that exact user.id.
  //    Doing it this way avoids the "infinite recursion in policy" trap
  //    where RLS on `profiles` depends on `profiles` itself.
  const admin = getSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle();

  return (profile as Profile | null) ?? null;
}

export async function requireAdmin(): Promise<
  | { ok: true; profile: Profile }
  | { ok: false; reason: "forbidden" }
> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { ok: false, reason: "forbidden" };
  }
  return { ok: true, profile };
}
