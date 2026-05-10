import { AboutSection } from "@/components/sections/AboutSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { DropPointSection } from "@/components/sections/DropPointSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { FranchiseCTASection } from "@/components/sections/FranchiseCTASection";
import { FranchiseSection } from "@/components/sections/FranchiseSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { OrderFlowSection } from "@/components/sections/OrderFlowSection";
import { QuickMenuSection } from "@/components/sections/QuickMenuSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { getBeforeAfter, getDropPoints, getPromoBanners, getServices, getTestimonials } from "@/lib/queries";

export default async function HomePage() {
  const [promoBanners, services, dropPoints, testimonials, beforeAfter] = await Promise.all([
    getPromoBanners(),
    getServices(),
    getDropPoints(),
    getTestimonials(),
    getBeforeAfter()
  ]);

  return (
    <>
      <HeroSection banners={promoBanners} />
      <QuickMenuSection />
      <AboutSection />
      {services.length ? <ServicesSection services={services} /> : null}
      <AdvantagesSection />
      {dropPoints.length ? <DropPointSection dropPoints={dropPoints} /> : null}
      <FranchiseSection />
      <OrderFlowSection />
      {beforeAfter.length ? <BeforeAfterSection items={beforeAfter} /> : null}
      {testimonials.length ? <TestimonialsSection testimonials={testimonials} /> : null}
      <FAQSection />
      <FinalCTASection />
      <FranchiseCTASection />
    </>
  );
}
