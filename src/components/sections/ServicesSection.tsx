import Link from "next/link";
import { SprayCan } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SPECIAL_SHOE_SURCHARGE } from "@/lib/pricing";
import { formatRupiah, formatThousands } from "@/lib/utils";
import type { Service } from "@/lib/types";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="layanan" className="section bg-white">
      <div className="container">
        <SectionHeading
          eyebrow="Treatment"
          title="Harga & Layanan"
          subtitle={`Tambahan mulai ${formatRupiah(SPECIAL_SHOE_SURCHARGE)} untuk bahan atau kondisi khusus.`}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`/booking?service=${service.slug}`} className="group">
              <Card className="flex min-h-40 flex-col border-2 border-[var(--brand)] p-4 transition hover:-translate-y-1 hover:border-black hover:shadow-[0_16px_34px_rgba(0,0,0,0.14)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-black text-[var(--brand)]">
                    <SprayCan size={19} />
                  </span>
                  <p className="text-4xl font-black leading-none text-black">{formatThousands(service.price)}</p>
                </div>
                <CardTitle className="mt-4 text-lg">{service.name}</CardTitle>
                <p className="mt-2 text-xs font-semibold leading-5 text-neutral-600">{service.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
