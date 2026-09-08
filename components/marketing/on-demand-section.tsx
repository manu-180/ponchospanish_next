"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronsRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

export function OnDemandSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-wide">
        <AnimatedSection className="mx-auto max-w-3xl text-center mb-14 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400 mb-4">
            What to expect
          </p>
          <h2 className="font-serif text-display-lg uppercase text-balance gradient-text">
            On-demand Spanish courses
          </h2>
          <p className="mt-4 text-base md:text-lg text-charcoal-400">
            Instant access. Start anytime.
          </p>
        </AnimatedSection>

        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.7,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="group relative"
          >
            <Link
              href="/ondemand"
              className="block h-full overflow-hidden rounded-3xl bg-cream-50 shadow-soft transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:shadow-soft-lg border border-charcoal-100/40 will-change-transform"
            >
              <div
                aria-hidden="true"
                className="relative aspect-[5/4] overflow-hidden rounded-t-3xl bg-charcoal-600"
              >
                <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_15%,rgb(255_255_255/0.12),transparent_62%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal-700/25 to-charcoal-700/55" />

                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="inline-flex items-center gap-3 rounded-full bg-mustard py-2.5 pl-7 pr-2.5 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.55)] transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none">
                    <span className="text-lg font-bold uppercase tracking-[0.06em] text-white sm:text-xl">
                      Download now
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                      <ChevronsRight className="h-5 w-5 text-mustard-600 transition-transform duration-500 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-7 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-400">
                    Independent learners
                  </p>
                  <h3 className="mt-1 font-serif text-2xl leading-tight uppercase">
                    On demand courses
                  </h3>
                </div>
                <div className="h-[2px] w-10 bg-mustard" />
                <p className="text-sm leading-relaxed text-charcoal-400">
                  Spanish courses designed for independent learners. Watch,
                  pause &amp; revisit lessons anytime. Made to fit your life,
                  not complicate it!
                </p>
                <div className="pt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mustard-600">
                  View courses
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
