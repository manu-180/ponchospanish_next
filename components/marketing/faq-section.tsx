import Link from "next/link";
import { homeFaqs } from "@/lib/seo/faq";

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center mb-10 md:mb-14">
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
        </div>

        <div className="divide-y divide-charcoal-100/60 rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft px-6 md:px-9">
            {homeFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group py-5"
              >
                <summary className="cursor-pointer font-serif text-lg leading-relaxed text-charcoal-500 marker:text-charcoal-600 hover:text-charcoal-600 md:text-xl">
                  {faq.question}
                </summary>
                <p className="mt-4 text-base leading-relaxed text-charcoal-500/85 max-w-2xl">
                  {faq.answer}
                </p>
              </details>
            ))}
        </div>
        <p className="mt-6 text-center text-sm text-charcoal-500">
          <Link href="/spanish-lessons" className="inline-block py-2 text-charcoal-600 underline underline-offset-4 hover:text-charcoal-500">Compare lesson options</Link>{" "}or read the{" "}<Link href="/legal/terms" className="inline-block py-2 text-charcoal-600 underline underline-offset-4 hover:text-charcoal-500">terms and conditions</Link>.
        </p>
      </div>
    </section>
  );
}
