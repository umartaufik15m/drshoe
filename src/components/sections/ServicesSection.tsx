import Link from "next/link";
import { ArrowRight, SprayCan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatRupiah } from "@/lib/utils";
import type { Service } from "@/lib/types";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="layanan" className="section bg-white">
      <div className="container">
        <SectionHeading
          eyebrow="Treatment"
          title="Pilihan Treatment DR. SHOE"
          subtitle="Pilih layanan sesuai kondisi sepatu. Admin akan bantu konfirmasi treatment terbaik setelah booking."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.slug} className="flex min-h-[260px] flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-[var(--brand)]">
                <SprayCan size={22} />
              </span>
              <CardTitle className="mt-5">{service.name}</CardTitle>
              <CardText>{service.description}</CardText>
              <p className="mt-6 text-2xl font-black">{formatRupiah(service.price)}</p>
              <Button asChild variant="outline" className="mt-auto">
                <Link href={`/booking?service=${service.slug}`}>
                  Pilih Layanan <ArrowRight size={16} />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
