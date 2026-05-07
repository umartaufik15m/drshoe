import { BookingForm } from "@/components/forms/BookingForm";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDropPoints, getServices } from "@/lib/queries";

type SearchParams = Promise<{
  service?: string;
  delivery?: string;
}>;

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [services, dropPoints] = await Promise.all([getServices(), getDropPoints()]);

  return (
    <section className="section bg-neutral-100">
      <div className="container grid gap-10 lg:grid-cols-[0.75fr_1fr]">
        <SectionHeading
          eyebrow="Booking"
          title="Booking Treatment Sepatu"
          subtitle="Isi data sepatu dan pilih metode pengiriman. Admin DR. SHOE akan menghubungi kamu melalui WhatsApp."
        />
        <BookingForm
          services={services}
          dropPoints={dropPoints}
          defaultService={params.service}
          defaultDelivery={params.delivery}
        />
      </div>
    </section>
  );
}
