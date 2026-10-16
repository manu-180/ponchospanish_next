"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { AcademyExtra } from "@/components/marketing/academy-extra";

const CALENDLY_URL = "https://calendly.com/ponchospanish/30min";

const services = [
  {
    id: "private",
    href: "/spanish-lessons/children",
    linkContext: "Spanish lessons for children",
    title: "Private lessons",
    subtitle: "Ages 7 – 18",
    bullet: "1:1 personalised support",
    description:
      "Lessons shaped around your child's interests, needs and goals.",
    image: "/images/foto1.jpeg",
    alt: "Private one-to-one online Spanish lessons for children and teens aged 7 to 18",
    accent: "from-mustard/40 to-mustard/0",
  },
  {
    id: "gcse",
    href: "/spanish-lessons/gcse",
    linkContext: "GCSE & IGCSE Spanish tuition",
    title: "(I)GCSE Exam Support",
    subtitle: "Confidence first",
    bullet:
      "Focused support for (I)GCSE preparation. Available as 1:1 personalised support.",
    description: "Perfect to boost confidence and calm nerves.",
    image: "/images/foto3.jpeg",
    alt: "GCSE and IGCSE Spanish exam support lessons online",
    accent: "from-mustard/30 to-terracotta/20",
  },
  {
    id: "adults",
    href: "/spanish-lessons/adults",
    linkContext: "Spanish lessons for adults",
    title: "Private lessons",
    subtitle: "Adults",
    bullet: "1:1 stress-free approach",
    description:
      "Designed for adults looking for personalised lessons built around your goals.",
    image: "/images/adulta-clases-online.jpg",
    alt: "Adult learner taking a relaxed one-to-one online Spanish lesson from home",
    accent: "from-terracotta/30 to-mustard/10",
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container-wide">
        <AnimatedSection className="mx-auto max-w-3xl text-center mb-14 md:mb-20">
          <h2 className="font-serif text-display-lg uppercase text-balance gradient-text">
            Online Spanish lessons
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400 mt-4">
            Start with a trial. See how it feels.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 1, y: 32 }}
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
                    alt={service.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-70 mix-blend-multiply`}
                  />
                </div>

                <div className="flex flex-1 flex-col p-7 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl leading-tight uppercase">
                      {service.title}
                    </h3>
                  </div>

                  <div className="h-[2px] w-10 bg-mustard" />

                  <p className="text-sm leading-relaxed text-charcoal-500/85">
                    {service.bullet}
                  </p>
                  <p className="text-sm leading-relaxed text-charcoal-400">
                    {service.description}
                  </p>

                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-terracotta-500">
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Poncho Academy included
                  </p>

                  <div className="flex-1" />

                  <Link
                    href={service.href}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-charcoal-600 underline underline-offset-4 hover:text-charcoal-500"
                  >
                    Learn More Here
                    <span className="sr-only">: {service.linkContext}</span>
                  </Link>

                  <Link
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-2 rounded-full bg-mustard text-charcoal-700 font-semibold uppercase tracking-wider text-sm px-6 py-3 hover:bg-mustard-500 active:bg-mustard-500 transition-[background-color,transform,box-shadow] duration-300 ease-out shadow-soft hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 motion-reduce:transform-none"
                  >
                    Book your trial
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          Find the right starting point: {" "}
          <Link href="/spanish-lessons" className="inline-block py-2 font-semibold text-charcoal-600 underline underline-offset-4 hover:text-charcoal-500">
            compare online Spanish lessons and prices
          </Link>.
        </p>

        <AcademyExtra />

        <AnimatedSection delay={0.2} className="mt-20 md:mt-24 text-center">
          <p className="font-serif italic text-2xl md:text-3xl text-mustard-600">
            <span className="uppercase not-italic font-semibold">I&rsquo;m</span>{" "}
            <span className="line-through text-charcoal-400 decoration-charcoal-400 decoration-[2px]">
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
