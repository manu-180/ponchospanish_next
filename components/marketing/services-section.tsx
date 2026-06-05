"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

const CALENDLY_URL = "https://calendly.com/ponchospanish/30min";

const services = [
  {
    title: "Private lessons",
    subtitle: "Ages 7 – 18",
    price: "£35 per session",
    bullet: "1:1 personalised support",
    description: "Ideal for children who prefer individual attention.",
    image: "/images/foto1.jpeg",
    accent: "from-mustard/40 to-mustard/0",
  },
  {
    title: "Start your own group",
    subtitle: "Ages 7 – 18",
    price: "£40 per session",
    priceNote: "(shared between the participants)",
    bullet: "Small group lessons with friends (up to 4 learners)",
    description:
      "A lovely balance between social learning and individual attention.",
    image: "/images/foto2.jpeg",
    accent: "from-terracotta/40 to-terracotta/0",
  },
  {
    title: "(I)GCSE Exam Support",
    subtitle: "Confidence first",
    price: "£50 per session",
    priceNote: "(shared between participants when learning as a group)",
    bullet:
      "Focused support for (I)GCSE preparation. Available as 1:1 personalised support or small group lessons with friends (up to 4 learners).",
    description: "Perfect to boost confidence and calm nerves.",
    image: "/images/foto3.jpeg",
    accent: "from-mustard/30 to-terracotta/20",
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container-wide">
        <AnimatedSection className="mx-auto max-w-3xl text-center mb-14 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400 mb-4">
            Start with a trial. See how it feels.
          </p>
          <h2 className="font-serif text-display-lg uppercase text-balance gradient-text">
            Online Spanish lessons
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
              className="group relative flex"
            >
              <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-soft-lg ring-1 ring-charcoal-100/30">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} — online Spanish lessons for kids and teens with Poncho Spanish`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-70 mix-blend-multiply`}
                  />
                </div>

                <div className="flex flex-1 flex-col p-7 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-400">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl leading-tight uppercase">
                      {service.title}
                    </h3>
                  </div>

                  <div className="h-[2px] w-10 bg-mustard" />

                  <p className="font-serif text-lg text-mustard-600">
                    {service.price}
                  </p>
                  {service.priceNote && (
                    <p className="-mt-3 text-xs italic text-charcoal-400">
                      {service.priceNote}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed text-charcoal-500/85">
                    {service.bullet}
                  </p>
                  <p className="text-sm leading-relaxed text-charcoal-400">
                    {service.description}
                  </p>

                  <div className="flex-1" />

                  <Link
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-2 rounded-full bg-mustard text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 hover:bg-mustard-500 active:bg-mustard-600 transition-colors shadow-soft hover:shadow-glow"
                  >
                    Book your trial
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.2} className="mt-20 md:mt-24 text-center">
          <p className="font-serif italic text-2xl md:text-3xl text-mustard-600">
            <span className="uppercase not-italic font-semibold">I&rsquo;m</span>{" "}
            <span className="line-through text-charcoal-400/70 decoration-charcoal-400/70 decoration-[2px]">
              we&rsquo;re
            </span>{" "}
            <span className="uppercase not-italic font-semibold">not</span> a big academy,
            <br className="hidden sm:inline" /> and that&rsquo;s a good thing!
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
