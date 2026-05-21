import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { AnimatedSection } from "@/components/shared/animated-section";

export const metadata: Metadata = {
  title: "Try a lesson · Get in touch",
  description:
    "Meet Anto, see our pricing and book a free trial Spanish lesson. We answer every message personally.",
};

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

interface ContactPageProps {
  searchParams: Promise<{ interest?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  return (
    <>
      {/* Bio */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-mustard/10 blur-3xl"
        />
        <div className="container-narrow text-center relative">
          <AnimatedSection>
            <div className="relative inline-block">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-mustard/40 via-terracotta/30 to-mustard/0 blur-xl opacity-70" />
              <div className="relative rounded-full bg-cream-50 p-1.5 shadow-soft-lg ring-1 ring-charcoal-100/40">
                <Image
                  src="/images/anto_profile.png"
                  alt="Anto — Spanish teacher"
                  width={240}
                  height={240}
                  priority
                  className="h-44 w-44 md:h-56 md:w-56 rounded-full object-cover"
                />
              </div>
            </div>
            <h1 className="mt-8 font-serif text-display-lg leading-tight">
              <span className="block text-mustard-600 italic">Hola!</span>
              <span className="block">My name is Anto.</span>
            </h1>
            <div className="prose-poncho mt-6 text-base md:text-lg leading-relaxed text-charcoal-500/85 space-y-5 mx-auto max-w-2xl text-left">
              <p>
                I&rsquo;m a certified ELE (<em>Español como Lengua Extranjera</em>) teacher
                and a native speaker from Buenos Aires, Argentina. I&rsquo;ve been
                teaching since 2005, both in schools and independently, and I
                absolutely love helping students discover the joy of learning a
                new language.
              </p>
              <p>
                For almost 10 years I also worked as cabin crew — an incredible
                experience that allowed me to explore new cultures and connect
                with people from all over the world. In 2020 I founded{" "}
                <strong>Poncho Spanish</strong> to create a learning experience
                that feels relaxed, positive, and meaningful.
              </p>
              <p>
                With nearly 20 years of experience teaching children and teens, my
                main focus is helping young learners grow in confidence and
                curiosity, while occasionally supporting adults who are looking
                for a similarly stress-free approach.
              </p>
              <p>
                My mission? To empower anyone who&rsquo;d like to open up to a whole
                new world of opportunities by giving them the gift of a new
                language. I look forward to connecting with you soon!
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600 mb-3">
                Investment options
              </p>
              <h2 className="font-serif text-display-md">
                Try a lesson!
              </h2>
            </div>

            <div className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft p-6 md:p-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta-400 mb-6">
                Our current rates
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

      {/* Form */}
      <section className="pb-24 md:pb-32">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="rounded-3xl bg-white shadow-soft-lg ring-1 ring-charcoal-100/40 p-6 md:p-10">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-2">
                Try a lesson and see if we&rsquo;re a good match!
              </h2>
              <p className="text-sm text-charcoal-400 mb-8">
                We answer every message personally. Usually within 24 hours.
              </p>
              <ContactForm defaultInterest={params.interest} />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
