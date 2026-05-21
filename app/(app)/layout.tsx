import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { AppHeader } from "@/components/learn/app-header";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-dvh flex-col bg-cream-100/50">
      <AppHeader
        email={user.email ?? ""}
        name={profile?.full_name ?? null}
        isAdmin={profile?.role === "admin"}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
