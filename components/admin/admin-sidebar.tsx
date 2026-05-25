"use client";

/**
 * Premium sidebar for the admin shell. Sticky on desktop, collapses to a
 * top sheet on mobile. Highlights the active section based on the URL.
 *
 * Design goals (for Anto, non-technical):
 *  - Vocabulary she uses ("Mis cursos", "Códigos", not "Routes")
 *  - Always-visible "create" actions, so she doesn't get stuck
 *  - Soft mustard accents on hover/active so it doesn't scream
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Ticket,
  Users,
  ShoppingBag,
  Star,
  Settings,
  Sparkles,
  Plus,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
}

const PRIMARY: NavItem[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Cursos", icon: GraduationCap, matchPrefix: true },
  {
    href: "/admin/digital-products",
    label: "Ebooks & extras",
    icon: FileText,
    matchPrefix: true,
  },
];

const COMMERCE: NavItem[] = [
  { href: "/admin/orders", label: "Pagos", icon: ShoppingBag },
  { href: "/admin/codes", label: "Códigos", icon: Ticket },
  { href: "/admin/students", label: "Alumnos", icon: Users },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
];

const ACCOUNT: NavItem[] = [
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

export function AdminSidebar({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;

  const initials =
    (name || email)
      .split(/\s+|@/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "A";

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  const NavSection = ({
    title,
    items,
  }: {
    title?: string;
    items: NavItem[];
  }) => (
    <div className="space-y-1">
      {title && (
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-300">
          {title}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-mustard text-white shadow-soft"
                : "text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-600",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors",
                active ? "text-white" : "text-charcoal-400 group-hover:text-mustard-600",
              )}
            />
            <span className="flex-1">{item.label}</span>
            {active && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
          </Link>
        );
      })}
    </div>
  );

  const Inner = (
    <>
      <div className="flex items-center gap-3 px-3 pb-4 pt-2">
        <Logo imageClassName="h-9" />
        <span className="rounded-full bg-mustard/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mustard-600">
          Admin
        </span>
      </div>

      <div className="px-3 pb-4">
        <Link
          href="/admin/courses/new"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-mustard via-mustard-400 to-terracotta px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow"
        >
          <Sparkles className="h-4 w-4" />
          Crear curso nuevo
          <Plus className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 pb-6">
        <NavSection items={PRIMARY} />
        <NavSection title="Comercio" items={COMMERCE} />
        <NavSection title="Cuenta" items={ACCOUNT} />
      </nav>

      <div className="border-t border-charcoal-100/60 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-cream-100/60 p-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mustard text-xs font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-charcoal-600">
              {name ?? email.split("@")[0]}
            </p>
            <p className="truncate text-[10px] text-charcoal-400">{email}</p>
          </div>
          <button
            onClick={signOut}
            aria-label="Cerrar sesión"
            className="rounded-md p-1.5 text-charcoal-400 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <Link
          href="/dashboard"
          className="mt-2 block rounded-md px-3 py-1.5 text-[11px] text-charcoal-400 hover:text-mustard-600"
        >
          ← Volver al sitio
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-charcoal-100/60 bg-cream-50/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <Logo imageClassName="h-8" />
          <span className="rounded-full bg-mustard/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mustard-600">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-charcoal-500 hover:bg-cream-100"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[57px] bottom-0 z-30 flex flex-col bg-cream-50 px-3 py-4 md:hidden">
          {Inner}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-charcoal-100/60 bg-cream-50/80 px-3 py-5 backdrop-blur-sm md:flex">
        {Inner}
      </aside>
    </>
  );
}
