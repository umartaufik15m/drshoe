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
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { getBeforeAfter, getDropPoints, getServices, getTestimonials } from "@/lib/queries";

export default async function HomePage() {
  const [services, dropPoints, testimonials, beforeAfter] = await Promise.all([
    getServices(),
    getDropPoints(),
    getTestimonials(),
    getBeforeAfter()
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection services={services} />
      <AdvantagesSection />
      <DropPointSection dropPoints={dropPoints} />
      <FranchiseSection />
      <OrderFlowSection />
      <BeforeAfterSection items={beforeAfter} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection />
      <FinalCTASection />
      <FranchiseCTASection />
    </>
  );
}
