import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth / Magic-link / email-confirmation callback.
 * Supabase will redirect here with a `code` query param which we exchange
 * for a session, then bounce the user to the requested redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(redirect, origin));
    }
  }

  return NextResponse.redirect(
    new URL("/auth/login?error=callback_failed", origin),
  );
}
