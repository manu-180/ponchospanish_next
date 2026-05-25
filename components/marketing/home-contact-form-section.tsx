import { ContactForm } from "@/components/marketing/contact-form";
import { AnimatedSection } from "@/components/shared/animated-section";

export function HomeContactFormSection() {
  return (
    <section id="contact" className="pb-24 md:pb-32 pt-4">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="rounded-3xl bg-white shadow-soft-lg ring-1 ring-charcoal-100/40 p-6 md:p-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-2">
              Try a lesson and see if we&rsquo;re a good match!
            </h2>
            <p className="text-sm text-charcoal-400 mb-8">
              We answer every message personally. Usually within 24 hours.
            </p>
            <ContactForm />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
