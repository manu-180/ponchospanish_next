"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const headline = ["Online", "Spanish", "lessons for", "kids & teens"];

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.getAttribute("src")) video.src = "/videos/video1.mp4";
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

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
          <div
            className="inline-flex items-center gap-2 rounded-full border border-mustard/40 bg-mustard/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-mustard-600"
          >
            <span className="size-1.5 rounded-full bg-mustard animate-pulse" />
            Online · One-to-one · Group · GCSE
          </div>

          <h1 className="font-serif text-display-2xl uppercase leading-[0.95] text-balance">
            {headline.map((word, i) => (
              <span
                key={word + i}
                className="block gradient-text"
              >
                {word}{i < headline.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p
            className="max-w-xl text-xl font-bold leading-snug text-charcoal-400 md:text-2xl"
          >
            Without the panic or the perfectionism.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:items-center"
          >
            <Button asChild size="pill-lg">
              <Link href="https://calendly.com/ponchospanish/30min" target="_blank" rel="noopener noreferrer">
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
          </div>

          <div
            className="flex items-center gap-6 pt-2 text-sm text-charcoal-400"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl text-charcoal-500">20+</span>
              <span>years teaching</span>
            </div>
            <div className="h-4 w-px bg-charcoal-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl text-charcoal-500">Native</span>
              <span>Spanish teacher</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-charcoal-200" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-serif text-xl text-charcoal-500">ELE</span>
              <span>certified</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-[2rem] shadow-soft-lg ring-1 ring-charcoal-100/40">
            <Image
              src="/images/hero-poster.webp"
              alt="A young learner taking an online Spanish lesson"
              fill
              priority
              sizes="(min-width: 1280px) 592px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="A young learner taking an online Spanish lesson"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-tr from-charcoal-700/30 via-transparent to-mustard/0"
            />
          </div>

          <motion.div
            whileHover={reducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.25 }}
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
        </div>
      </div>
    </section>
  );
}
