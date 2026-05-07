import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function FinalCTASection() {
  return (
    <section className="section-tight bg-[var(--brand)]">
      <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-normal md:text-5xl">Siap Bikin Sepatu Balik Bersih?</h2>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-neutral-800">
            Pilih treatment, tentukan metode pengiriman, dan biarkan DR. SHOE merawat sepatu favoritmu.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild>
            <Link href="/booking">Booking Sekarang</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Tanya Admin
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
