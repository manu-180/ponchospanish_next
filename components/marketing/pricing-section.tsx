"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { siteConfig } from "@/lib/seo/config";

const options = [
  {
    title: "Trial Lesson",
    price: "Free",
    unit: null,
    note: "Around 30 minutes, with no commitment afterwards. Simply a chance to meet, experience a session and see if we're the right fit.",
  },
  {
    title: "Private Lessons (1:1)",
    price: "£150",
    unit: "per month",
    note: "Available for kids (7+), teens and adults.",
  },
  {
    title: "Exam Support (I-GCSE Spanish)",
    price: "£180",
    unit: "per month",
    note: "1:1 personalised support.",
  },
];

const details = [
  {
    heading: "Lesson format",
    body: "All sessions last 50 minutes, take place online via Zoom and run during UK term time.",
  },
  {
    heading: "Payments",
    body: "Fees are payable monthly via PayPal, in GBP or the equivalent in your local currency, at the beginning of each month and before its first lesson. No lessons are scheduled during the UK school holidays unless agreed in advance. As your space is reserved in advance, monthly fees are non-refundable, in full or in part, once the month has begun.",
  },
  {
    heading: "Unenrolment",
    body: "You're free to unenrol at any time during the year. Please give notice before the next monthly payment is due.",
  },
];

export function PricingSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="mb-10 text-center">
            <h2 className="font-serif text-display-md uppercase">
              Investment Options
            </h2>
          </div>

          <div className="rounded-3xl bg-cream-50 p-6 shadow-soft ring-1 ring-charcoal-100/40 md:p-10">
            <div className="divide-y divide-charcoal-100/60">
              {options.map((o) => (
                <div key={o.title} className="py-6 first:pt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold text-charcoal-600">{o.title}</p>
                    <p className="shrink-0 font-serif text-charcoal-600">
                      <span className="text-2xl">{o.price}</span>
                      {o.unit && (
                        <span className="ml-1.5 font-sans text-sm text-charcoal-400">
                          {o.unit}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-charcoal-400">
                    {o.note}
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-4 space-y-5 border-t border-charcoal-100/60 pt-8">
              {details.map((d) => (
                <div
                  key={d.heading}
                  className="grid gap-1.5 md:grid-cols-[10rem_1fr] md:gap-6"
                >
                  <dt className="pt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-500">
                    {d.heading}
                  </dt>
                  <dd className="text-sm leading-relaxed text-charcoal-500/85">
                    {d.body}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-charcoal-400">
              Term dates and the full policies are in the{" "}
              <Link
                href="/legal/terms"
                className="font-semibold text-charcoal-600 underline underline-offset-4 hover:text-charcoal-500"
              >
                terms and conditions
              </Link>
              .
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="mt-16 text-center md:mt-20">
          <h3 className="font-serif text-display-md uppercase leading-tight text-balance">
            Small by design.
            <span className="block italic normal-case text-mustard-600">
              Personal by nature.
            </span>
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-charcoal-500/85 md:text-lg">
            Spaces are very limited to ensure every student receives the time,
            attention and personalised support they deserve.
          </p>
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-mustard px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-charcoal-700 shadow-soft transition-[background-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-mustard-500 hover:shadow-lift active:translate-y-0 motion-reduce:transform-none"
          >
            Check current availability
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
