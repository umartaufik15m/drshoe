import { FranchiseInquiryForm } from "@/components/forms/FranchiseInquiryForm";
import { FranchiseSection } from "@/components/sections/FranchiseSection";
import { SectionHeading } from "@/components/ui/section-heading";

export default function FranchisePage() {
  return (
    <>
      <section className="section bg-neutral-100">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1fr]">
          <SectionHeading
            eyebrow="Franchise"
            title="Ajukan Minat Franchise DR. SHOE"
            subtitle="Ceritakan area, modal, dan tipe kerja sama yang kamu incar. Tim DR. SHOE akan follow up untuk konsultasi."
          />
          <FranchiseInquiryForm />
        </div>
      </section>
      <FranchiseSection />
    </>
  );
}
