"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/shared/animated-section";

export function AboutAntoSection() {
  return (
    <section
      id="about"
      className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-cream-50/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-mustard/10 blur-3xl"
      />

      <div className="container-wide relative">
        <AnimatedSection className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="font-serif text-display-md text-balance gradient-text">
            Built by a real human, with real teaching experience and a
            supportive approach to learning.
          </h2>
        </AnimatedSection>

        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="relative inline-block">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-mustard/40 via-terracotta/30 to-mustard/0 blur-xl opacity-70" />
              <div className="relative rounded-full bg-cream-50 p-1.5 shadow-soft-lg ring-1 ring-charcoal-100/40">
                <Image
                  src="/images/nuevafotodeanto.jpg"
                  alt="Anto, certified Spanish teacher and founder of Poncho Spanish"
                  width={240}
                  height={240}
                  className="h-44 w-44 md:h-56 md:w-56 rounded-full object-cover"
                />
              </div>
            </div>
            <h3 className="mt-8 font-serif text-display-md leading-tight">
              <span className="block text-mustard-600 italic">Hola!</span>
              <span className="block">My name is Anto.</span>
            </h3>
            <div className="prose-poncho mt-6 text-base md:text-lg leading-relaxed text-charcoal-500/85 space-y-5 mx-auto max-w-2xl text-left">
              <p>
                I&rsquo;m a certified ELE (
                <em>Español como Lengua Extranjera</em>) teacher and a native
                speaker from Buenos Aires, Argentina. I&rsquo;ve been teaching
                since 2005, both in schools and independently, and I absolutely
                love helping students discover the joy of learning a new
                language.
              </p>
              <p>
                For almost 10 years I also worked as cabin crew — an incredible
                experience that allowed me to explore new cultures and connect
                with people from all over the world. In 2020 I founded{" "}
                <strong>Poncho Spanish</strong> to create a learning experience
                that feels relaxed, positive, and meaningful.
              </p>
              <p>
                With nearly 20 years of experience teaching children and teens,
                my main focus is helping young learners grow in confidence and
                curiosity, while occasionally supporting adults who are looking
                for a similarly stress-free approach.
              </p>
              <p>
                My mission? To empower anyone who&rsquo;d like to open up to a
                whole new world of opportunities by giving them the gift of a
                new language. I look forward to connecting with you soon!
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
