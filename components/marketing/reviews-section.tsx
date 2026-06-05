"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const reviews = [
  "/images/review1.jpeg",
  "/images/review2.jpeg",
  "/images/review3.jpeg",
  "/images/review4.jpeg",
  "/images/review5.jpeg",
];

export function ReviewsSection() {
  return (
    <section className="relative py-20 md:py-28 bg-cream-100/60 border-y border-charcoal-100/40">
      <div className="container-wide">
        <div className="text-center mb-12 md:mb-16">
          <div
            aria-hidden="true"
            className="dotted-divider text-terracotta-300 mx-auto w-32 mb-6"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600 mb-3">
            Word of mouth
          </p>
          <h2 className="font-serif text-display-md text-balance">
            What families value most
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((src, i) => (
              <motion.figure
                key={src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-charcoal-100/40 hover:shadow-soft-lg transition-shadow duration-500"
              >
                <div className="absolute top-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-mustard/15 text-mustard-600 z-10">
                  <Quote className="h-4 w-4" />
                </div>
                <div className="relative w-full">
                  <Image
                    src={src}
                    alt={`Parent review of Poncho Spanish online Spanish lessons (${i + 1})`}
                    width={600}
                    height={800}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
