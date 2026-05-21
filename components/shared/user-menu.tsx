"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut, User as UserIcon, BookOpen, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface UserMenuProps {
  email: string;
  name?: string | null;
  isAdmin?: boolean;
}

export function UserMenu({ email, name, isAdmin }: UserMenuProps) {
  const router = useRouter();
  const initials = (name || email)
    .split(/\s+|@/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-full bg-cream-50 pl-1 pr-4 ring-1 ring-charcoal-100/40 hover:ring-mustard/50 transition-all"
          aria-label="Account menu"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mustard text-white font-semibold text-xs">
            {initials}
          </span>
          <span className="hidden sm:block text-sm font-medium text-charcoal-500 max-w-[140px] truncate">
            {name ?? email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "z-50 min-w-[220px] rounded-2xl border border-charcoal-100/40 bg-cream-50 p-2 shadow-soft-lg text-charcoal-500",
        )}
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs text-charcoal-400 truncate">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="h-px bg-charcoal-100/60 my-1" />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-mustard/10 outline-none cursor-pointer"
          >
            <BookOpen className="h-4 w-4" /> My Academy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/account"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-mustard/10 outline-none cursor-pointer"
          >
            <UserIcon className="h-4 w-4" /> Account
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-mustard/10 outline-none cursor-pointer"
            >
              <Settings2 className="h-4 w-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="h-px bg-charcoal-100/60 my-1" />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            signOut();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-destructive/10 hover:text-destructive outline-none cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
