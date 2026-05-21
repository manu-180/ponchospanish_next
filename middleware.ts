import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimisation files)
     * - favicon.ico
     * - public assets (images, videos, pdf)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|videos|pdf|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|pdf)$).*)",
  ],
};
