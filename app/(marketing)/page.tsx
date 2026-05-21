import { HeroSection } from "@/components/marketing/hero-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { ReviewsSection } from "@/components/marketing/reviews-section";
import { AcademySection } from "@/components/marketing/academy-section";
import { CtaVideoSection } from "@/components/marketing/cta-video-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
      <AcademySection />
      <CtaVideoSection />
    </>
  );
}
