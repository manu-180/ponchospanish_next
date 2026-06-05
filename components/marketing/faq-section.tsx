"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/shared/animated-section";
import { homeFaqs } from "@/lib/seo/faq";

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400 mb-4">
            Good to know
          </p>
          <h2 className="font-serif text-display-md uppercase text-balance gradient-text">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base md:text-lg text-charcoal-400">
            Everything parents usually ask about online Spanish lessons for kids
            and teens.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft px-6 md:px-9"
          >
            {homeFaqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="last:border-b-0"
              >
                <AccordionTrigger className="font-serif text-lg md:text-xl py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-charcoal-500/85 max-w-2xl">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}
