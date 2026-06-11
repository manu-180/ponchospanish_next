import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { OnDemandSection } from "@/components/marketing/on-demand-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { ReviewsSection } from "@/components/marketing/reviews-section";
import { AboutAntoSection } from "@/components/marketing/about-anto-section";
import { CtaVideoSection } from "@/components/marketing/cta-video-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { HomeContactFormSection } from "@/components/marketing/home-contact-form-section";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, faqPageSchema, lessonServicesSchema } from "@/lib/seo/schema";
import { homeFaqs } from "@/lib/seo/faq";

export const metadata: Metadata = {
  title: "Spanish Lessons for Kids & Teens in the UK",
  description:
    "Online Spanish lessons for kids & teens in the UK. Private 1-to-1 classes, small groups and GCSE support with a certified native teacher. Book a free trial.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Spanish Lessons for Kids & Teens — Poncho Spanish",
    description:
      "Private 1-to-1 classes, small groups and GCSE support. Book your free trial with a certified native teacher.",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OnDemandSection />
      <ServicesSection />
      <ReviewsSection />
      <AboutAntoSection />
      <CtaVideoSection />
      <PricingSection />
      <FaqSection />
      <HomeContactFormSection />
      <JsonLd
        data={graph(faqPageSchema(homeFaqs), ...lessonServicesSchema())}
      />
    </>
  );
}
