"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, BookOpen, ChevronRight, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const quickLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/ondemand", label: "On-demand classes" },
];

export default function NotFound() {
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
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/10 blur-3xl"
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
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-2xl text-center">

          {/* Giant decorative 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease }}
            aria-hidden
            className="pointer-events-none select-none font-display text-[9rem] font-bold leading-none tracking-tight text-mustard/20 sm:text-[13rem]"
          >
            404
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="-mt-4 mb-6 inline-flex items-center gap-2 rounded-full border border-mustard/40 bg-mustard/10 px-4 py-1.5 sm:-mt-6"
          >
            <MapPin className="size-3.5 text-mustard-500" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mustard-600">
              Page not found
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mb-5 text-balance font-display text-display-lg font-bold text-charcoal-500"
          >
            ¡Ay, no!{" "}
            <span className="text-mustard-400">Lost in translation?</span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
            className="mb-10 text-lg leading-relaxed text-charcoal-400"
          >
            This page doesn&apos;t exist — but your Spanish journey does.
            <br className="hidden sm:block" />
            Let&apos;s get you back on track.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button asChild size="pill-lg">
              <Link href="/">
                <Home className="size-4" />
                Take me home
              </Link>
            </Button>
            <Button asChild variant="outline" size="pill-lg">
              <Link href="/#pricing">
                <BookOpen className="size-4" />
                Start learning
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
