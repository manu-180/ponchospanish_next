import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  email: string;
  name: string | null;
  isAdmin: boolean;
  variant?: "default" | "admin";
}

export function AppHeader({ email, name, isAdmin, variant = "default" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-charcoal-100/40 bg-cream/90 backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo imageClassName="h-10" />
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold uppercase tracking-wider">
            {variant === "admin" ? (
              <>
                <Link
                  href="/admin"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/courses"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/admin/codes"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  Access codes
                </Link>
                <Link
                  href="/admin/students"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  Students
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  My Academy
                </Link>
                <Link
                  href="/ondemand"
                  className="px-3 py-2 text-charcoal-500 hover:text-mustard-600 transition-colors"
                >
                  Browse
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {variant !== "admin" && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/#contact">Need help?</Link>
            </Button>
          )}
          <UserMenu email={email} name={name} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
