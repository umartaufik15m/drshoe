import { StatusLookup } from "@/components/status/StatusLookup";
import { SectionHeading } from "@/components/ui/section-heading";

export default function StatusPage() {
  return (
    <section className="section bg-neutral-100">
      <div className="container grid gap-10 lg:grid-cols-[0.75fr_1fr]">
        <SectionHeading
          eyebrow="Status Booking"
          title="Cek Status Treatment"
          subtitle="Masukkan nomor WhatsApp yang dipakai saat booking untuk melihat update status sepatu."
        />
        <StatusLookup />
      </div>
    </section>
  );
}
