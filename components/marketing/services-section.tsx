"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

const services = [
  {
    title: "Private lessons",
    subtitle: "Ages 7 – 18",
    description:
      "Lessons shaped around your child, their world, and what makes them light up. Designed to grow real confidence.",
    image: "/images/foto1.jpeg",
    accent: "from-mustard/40 to-mustard/0",
    href: "/contact?interest=private",
  },
  {
    title: "Start your own group",
    subtitle: "Up to 4 learners",
    description:
      "Real chats, real laughs, real progress. You decide who joins. We arrange the time together.",
    image: "/images/foto2.jpeg",
    accent: "from-terracotta/40 to-terracotta/0",
    href: "/contact?interest=group",
  },
  {
    title: "(I)GCSE Exam Support",
    subtitle: "Confidence first",
    description:
      "Personalised lessons designed to boost confidence and calm nerves. Clear guidance and a friendly space to get exam-ready.",
    image: "/images/foto3.jpeg",
    accent: "from-mustard/30 to-terracotta/20",
    href: "/contact?interest=gcse",
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container-wide">
        <AnimatedSection className="mx-auto max-w-3xl text-center mb-14 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600 mb-4">
            Here&rsquo;s what we do
          </p>
          <h2 className="font-serif text-display-lg text-balance">
            <span className="text-charcoal-500">Made to fit your life,</span>
            <br />
            <span className="gradient-text">not complicate it.</span>
          </h2>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group relative"
            >
              <Link
                href={service.href}
                className="block h-full overflow-hidden rounded-3xl bg-cream-50 shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-soft-lg ring-1 ring-charcoal-100/30"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-70 mix-blend-multiply`}
                  />
                  <div className="absolute top-4 right-4 inline-flex items-center justify-center h-9 w-9 rounded-full bg-cream/95 text-charcoal-500 backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-400">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl leading-tight">
                      {service.title}
                    </h3>
                  </div>
                  <div className="h-[2px] w-10 bg-mustard" />
                  <p className="text-sm leading-relaxed text-charcoal-400">
                    {service.description}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mustard-600">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.2} className="mt-20 md:mt-24 text-center">
          <p className="font-serif italic text-2xl md:text-3xl text-mustard-600">
            Made by real people,
            <br className="hidden sm:inline" /> for real people.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
