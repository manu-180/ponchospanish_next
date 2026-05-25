import { HeroSection } from "@/components/marketing/hero-section";
import { OnDemandSection } from "@/components/marketing/on-demand-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { ReviewsSection } from "@/components/marketing/reviews-section";
import { AboutAntoSection } from "@/components/marketing/about-anto-section";
import { CtaVideoSection } from "@/components/marketing/cta-video-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { HomeContactFormSection } from "@/components/marketing/home-contact-form-section";

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
      <HomeContactFormSection />
    </>
  );
}
