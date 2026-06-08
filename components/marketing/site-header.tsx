"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, BookOpen, Mail, GraduationCap, LogIn } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/ponchospanish/30min";

interface SiteHeaderProps {
  isAuthenticated?: boolean;
}

const links = [
  { href: "/", label: "Home", icon: null },
  { href: "/ondemand", label: "Academy", icon: GraduationCap },
  { href: "/#contact", label: "Get in Touch", icon: Mail },
];

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Animated nav underline. We measure the active link with offsetLeft/
  // offsetWidth (relative to <nav>, NOT the viewport) so the position is
  // immune to page scroll. A Framer `layoutId` here mis-projects while the
  // header is `position: sticky` and the page is scrolled, making the bar
  // overshoot/bounce — this avoids that entirely.
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(
    null,
  );

  const activeIndex = links.findIndex(
    (link) =>
      pathname === link.href ||
      (link.href !== "/" && pathname.startsWith(link.href)),
  );

  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current[activeIndex];
      if (!el) {
        setUnderline(null);
        return;
      }
      // px-4 (16px) inset on each side to match the text, not the padding box.
      setUnderline({ left: el.offsetLeft + 16, width: el.offsetWidth - 32 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-b border-charcoal-100/30 shadow-soft"
          : "bg-transparent",
      )}
    >
      <div className="container-wide flex h-20 items-center justify-between gap-6">
        <Logo priority />

        <nav ref={navRef} className="relative hidden md:flex items-center gap-1">
          {links.map((link, i) => {
            const active = i === activeIndex;
            return (
              <Link
                key={link.href}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
                  active
                    ? "text-mustard-600"
                    : "text-charcoal-500 hover:text-mustard-600",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {underline && (
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-0.5 h-[2px] rounded-full bg-mustard transition-[transform,width] duration-500 ease-out"
              style={{
                transform: `translateX(${underline.left}px)`,
                width: underline.width,
              }}
            />
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="soft"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <BookOpen className="h-4 w-4" />
              My Academy
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/auth/login")}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
          <Button asChild size="pill">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a trial</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal-500 hover:bg-charcoal-100/40 transition-colors"
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="md:hidden overflow-hidden border-b border-charcoal-100/30 bg-cream/95 backdrop-blur-xl"
          >
            <nav className="container-wide flex flex-col gap-1 py-4">
              {links.map((link) => {
                const active = pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                      active
                        ? "bg-mustard/10 text-mustard-600"
                        : "text-charcoal-500 hover:bg-charcoal-100/40",
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-3 px-1 pb-2">
                {isAuthenticated ? (
                  <Button
                    variant="soft"
                    onClick={() => router.push("/dashboard")}
                  >
                    <BookOpen className="h-4 w-4" />
                    My Academy
                  </Button>
                ) : (
                  <Button
                    variant="soft"
                    onClick={() => router.push("/auth/login")}
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Button>
                )}
                <Button asChild size="lg">
                  <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a trial</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
