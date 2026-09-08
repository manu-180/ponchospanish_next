"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const reviews = [
  { src: "/images/review1.jpeg", width: 1170, height: 916 },
  { src: "/images/review2.jpeg", width: 1170, height: 1275 },
  { src: "/images/review3.jpeg", width: 1170, height: 666 },
  { src: "/images/review4.jpeg", width: 1170, height: 866 },
  { src: "/images/review5.jpeg", width: 1170, height: 686 },
];

// Short text-only screenshots — stacked vertically to fill the 6th grid slot
const shortReviews = [
  { src: "/images/textreview1.jpg", width: 1060, height: 183 },
  { src: "/images/textreview2.jpg", width: 860, height: 149 },
  { src: "/images/textreview3.jpg", width: 882, height: 203 },
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-500 mb-3">
            Word of mouth
          </p>
          <h2 className="font-serif text-display-md text-balance">
            What families value most
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map(({ src, width, height }, i) => (
              <motion.figure
                key={src}
                initial={{ opacity: 1, y: 24 }}
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
                    width={width}
                    height={height}
                    sizes="(min-width: 1024px) 328px, (min-width: 640px) 46vw, 100vw"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.figure>
            ))}

            {/* Stacked cell — fills the empty 6th slot with short text screenshots */}
            <motion.div
              initial={{ opacity: 1, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: reviews.length * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="flex flex-col gap-5"
            >
              {shortReviews.map(({ src, width, height }, i) => (
                <figure
                  key={src}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-charcoal-100/40 hover:shadow-soft-lg transition-shadow duration-500"
                >
                  <div className="absolute top-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-mustard/15 text-mustard-600 z-10">
                    <Quote className="h-4 w-4" />
                  </div>
                  <div className="relative w-full">
                    <Image
                      src={src}
                      alt={`Parent review of Poncho Spanish online Spanish lessons (${reviews.length + i + 1})`}
                      width={width}
                      height={height}
                      sizes="(min-width: 1024px) 328px, (min-width: 640px) 46vw, 100vw"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </figure>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
