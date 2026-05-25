import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getCurrentProfile,
} from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin — Poncho",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?redirect=/admin");
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard?error=forbidden");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex">
        <AdminSidebar email={profile.email} name={profile.full_name} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
