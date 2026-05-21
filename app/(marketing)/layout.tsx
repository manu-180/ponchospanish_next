import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = false;
  try {
    const user = await getCurrentUser();
    isAuthenticated = Boolean(user);
  } catch {
    // No Supabase configured yet — treat as anonymous.
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
