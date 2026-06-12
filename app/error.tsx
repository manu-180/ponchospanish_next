"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, BookOpen, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const quickLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/ondemand", label: "On-demand classes" },
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grain-overlay relative flex min-h-dvh flex-col overflow-hidden bg-cream-200">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-48 h-[640px] w-[640px] rounded-full bg-mustard/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-terracotta/15 blur-3xl"
      />

      {/* Minimal header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="group font-display text-xl font-bold text-charcoal-500 transition-colors hover:text-mustard-400"
        >
          Poncho Spanish
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-charcoal-400 transition-colors hover:text-charcoal-500"
        >
          Back to home
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-2xl text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-terracotta/40 bg-terracotta/10 px-4 py-1.5"
          >
            <AlertTriangle className="size-3.5 text-terracotta-500" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">
              Something went wrong
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mb-5 text-balance font-display text-display-lg font-bold text-charcoal-500"
          >
            ¡Ay! An unexpected{" "}
            <span className="text-mustard-400">error occurred.</span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
            className="mb-10 text-lg leading-relaxed text-charcoal-400"
          >
            Don&apos;t worry — your progress is safe.
            <br className="hidden sm:block" />
            Try refreshing, or head back home.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button size="pill-lg" onClick={reset}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
            <Button asChild variant="outline" size="pill-lg">
              <Link href="/">
                <Home className="size-4" />
                Take me home
              </Link>
            </Button>
            <Button asChild variant="outline" size="pill-lg">
              <Link href="/ondemand">
                <BookOpen className="size-4" />
                Browse courses
              </Link>
            </Button>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400/50">
              Or explore
            </span>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1 text-sm font-medium text-charcoal-400 transition-colors hover:text-mustard-500"
              >
                {link.label}
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center sm:px-8">
        <p className="text-xs text-charcoal-400/40">
          © {new Date().getFullYear()} Poncho Spanish · Real lessons, real results
        </p>
      </footer>
    </div>
  );
}
