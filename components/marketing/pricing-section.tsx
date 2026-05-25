"use client";

import { AnimatedSection } from "@/components/shared/animated-section";

const pricing = [
  { title: "Trial Lesson", price: "Free of charge.", note: null },
  { title: "Private Lessons", price: "£35 per session", note: null },
  {
    title: "Start Your Own Group",
    price: "£40 per session",
    note: "(shared between the participants)",
  },
  { title: "Exam Support", price: "£50 per session", note: null },
];

export function PricingSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600 mb-3">
              Investment options
            </p>
            <h2 className="font-serif text-display-md uppercase">
              Get in touch
            </h2>
          </div>

          <div className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft p-6 md:p-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta-400 mb-6">
              Current investment options
            </h3>
            <div className="space-y-5 divide-y divide-charcoal-100/60">
              {pricing.map((p) => (
                <div key={p.title} className="pt-5 first:pt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold text-charcoal-500">{p.title}</p>
                    <p className="font-serif text-lg text-mustard-600">
                      {p.price}
                    </p>
                  </div>
                  {p.note && (
                    <p className="mt-1 text-sm italic text-charcoal-400">
                      {p.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-charcoal-400">
              All sessions are 50 minutes long and take place online via Zoom
              during term time. Fees are payable monthly via PayPal (in GBP or
              the equivalent in your local currency). Adult lessons can be
              arranged upon request.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
