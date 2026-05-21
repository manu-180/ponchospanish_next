import { redirect } from "next/navigation";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountForm } from "@/components/learn/account-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const profile = await getCurrentProfile();

  return (
    <div className="container-narrow py-10 md:py-14 space-y-8">
      <header>
        <h1 className="font-serif text-display-md">Your account</h1>
        <p className="mt-2 text-charcoal-400">
          Manage your profile and how we contact you.
        </p>
      </header>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal-500">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-charcoal-300" /> {user.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-charcoal-300" />{" "}
              Member since {new Date(user.created_at ?? Date.now()).toLocaleDateString()}
            </span>
            {profile?.role === "admin" && (
              <Badge variant="terracotta">
                <ShieldCheck className="h-3 w-3 mr-1" /> Admin
              </Badge>
            )}
          </div>

          <AccountForm
            userId={user.id}
            email={user.email ?? ""}
            initialFullName={profile?.full_name ?? user.user_metadata?.full_name ?? ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 md:p-8">
          <h3 className="font-serif text-xl mb-4 flex items-center gap-2">
            <UserRound className="h-5 w-5" /> Sign out everywhere
          </h3>
          <p className="text-sm text-charcoal-400 mb-4">
            End the current session on this device.
          </p>
          <form action="/api/auth/signout" method="POST">
            <Button variant="soft" type="submit">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
