import Link from "next/link";
import { ExternalLink, MapPin, MessageCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { WORKSHOP_ADDRESS, WORKSHOP_MAPS_URL } from "@/lib/constants";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";
import type { DropPoint } from "@/lib/types";

export function DropPointSection({ dropPoints }: { dropPoints: DropPoint[] }) {
  return (
    <section id="drop-point" className="section bg-neutral-100">
      <div className="container">
        <SectionHeading
          eyebrow="Drop Point"
          title="Drop Sepatumu di Lokasi Terdekat"
          subtitle="Tidak sempat datang langsung? Titipkan sepatu kamu di drop point resmi DR. SHOE. Saat ini tersedia di Kopi Peneleh dan Coffee Studio."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {dropPoints.map((point) => (
            <Card key={point.slug}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)]">
                  <MapPin size={22} />
                </span>
                <Badge>Drop Point Resmi</Badge>
              </div>
              <CardTitle className="mt-5">{point.name}</CardTitle>
              <CardText>
                <span className="font-black text-neutral-900">Alamat: </span>
                {point.address || "Cek alamat lengkap melalui Google Maps."}
              </CardText>
              {point.address && point.description ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">{point.description}</p>
              ) : null}
              {point.maps_url ? (
                <Button asChild variant="outline" size="sm" className="mt-5">
                  <a href={point.maps_url} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} /> Buka Maps
                  </a>
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
        <Card className="mt-5 border-2 border-black bg-white p-7 shadow-[7px_7px_0_#f8e71c]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-black text-[var(--brand)]">
                <Store size={26} />
              </span>
              <div>
                <Badge>Workshop Utama</Badge>
                <h3 className="mt-3 text-2xl font-black tracking-normal md:text-3xl">Workshop DR. SHOE</h3>
                <p className="mt-2 text-base font-black leading-7 text-neutral-900">{WORKSHOP_ADDRESS}</p>
              </div>
            </div>
            <Button asChild variant="brand" className="shrink-0">
              <a href={WORKSHOP_MAPS_URL} target="_blank" rel="noreferrer">
                <ExternalLink size={16} /> Buka Maps
              </a>
            </Button>
          </div>
        </Card>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand">
            <Link href="/booking?delivery=drop_point">Pilih Drop Point</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Booking via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
