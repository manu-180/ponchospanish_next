"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const headline = ["We help", "curious minds", "learn", "Spanish"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-mustard/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-terracotta/15 blur-3xl"
      />

      <div className="container-wide relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-2 rounded-full border border-mustard/40 bg-mustard/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-mustard-600"
          >
            <span className="size-1.5 rounded-full bg-mustard animate-pulse" />
            Online · One-to-one · Group · GCSE
          </motion.div>

          <h1 className="font-serif text-display-2xl uppercase leading-[0.95] text-balance">
            {headline.map((word, i) => (
              <motion.span
                key={word + i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="block gradient-text"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-lg leading-relaxed text-charcoal-500/85 max-w-xl"
          >
            Online classes for kids &amp; teens (and the occasional curious
            grown-up) who want to speak <strong>Spanish</strong> without the
            panic or the perfectionism.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:items-center"
          >
            <Button asChild size="pill-lg">
              <Link href="/contact">
                Book a free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="pill-lg" className="text-charcoal-500">
              <Link href="/ondemand">
                <PlayCircle className="h-5 w-5" />
                Explore the Academy
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center gap-6 pt-2 text-sm text-charcoal-400"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl text-mustard-600">20+</span>
              <span>years teaching</span>
            </div>
            <div className="h-4 w-px bg-charcoal-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl text-mustard-600">100+</span>
              <span>happy families</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-charcoal-200" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-serif text-xl text-mustard-600">★ 5.0</span>
              <span>parent reviews</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-[2rem] shadow-soft-lg ring-1 ring-charcoal-100/40">
            <video
              src="/videos/video1.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="A welcome from Anto, Spanish teacher"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-tr from-charcoal-700/30 via-transparent to-mustard/0"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -16, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute -bottom-6 -left-4 sm:-left-8 max-w-[260px] glass-card rounded-2xl p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-mustard-600 font-semibold mb-1">
              Made for real life
            </p>
            <p className="font-serif text-base leading-snug">
              “Lessons shaped around your child &mdash; not the other way
              around.”
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
