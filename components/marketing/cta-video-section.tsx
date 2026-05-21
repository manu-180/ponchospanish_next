"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaVideoSection() {
  return (
    <section className="relative overflow-hidden h-[520px] md:h-[560px]">
      <video
        src="/videos/video2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-charcoal-700/45 via-charcoal-700/55 to-charcoal-700/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(232,168,76,0.18)_0%,_transparent_60%)]"
      />

      <div className="relative container-wide h-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-8 max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mustard-200">
            Let&rsquo;s begin
          </p>
          <h2 className="font-serif text-display-xl text-white text-balance">
            Ready to start
            <br />
            <span className="italic text-mustard-200">your journey?</span>
          </h2>
          <p className="text-lg text-cream/85 max-w-xl mx-auto">
            Book a free trial lesson — or jump straight into our online Academy
            and start at your own pace, today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="pill-lg">
              <Link href="/contact">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="pill-lg"
              variant="soft"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md"
            >
              <Link href="/ondemand">Browse the Academy</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
