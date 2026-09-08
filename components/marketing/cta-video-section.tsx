"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CALENDLY_URL = "https://calendly.com/ponchospanish/30min";

export function CtaVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || reducedMotion.matches) {
          video.pause();
          return;
        }
        if (!video.getAttribute("src")) video.src = "/videos/video2.mp4";
        void video.play().catch(() => {});
      },
      { rootMargin: "200px" },
    );

    const onMotionChange = () => {
      if (reducedMotion.matches) video.pause();
    };
    observer.observe(video);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      video.pause();
    };
  }, []);

  return (
    <section className="relative overflow-hidden h-[560px] md:h-[600px] bg-charcoal-600">
      <Image
        src="/images/cta-poster.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
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
          initial={{ opacity: 1, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-8 max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mustard-200">
            Let&rsquo;s begin
          </p>
          <h2 className="font-serif text-display-xl text-white text-balance uppercase">
            Ready to start?
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-lg text-cream/90">
              Book a free trial lesson now and see how supportive learning can
              make a real difference.
            </p>
            <p className="text-sm text-cream/75 italic">
              Spaces are limited, so early booking is recommended.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button asChild size="pill-lg">
              <Link
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book your free trial lesson now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
