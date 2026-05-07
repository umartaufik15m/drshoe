import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const consultUrl = createWhatsAppUrl(
  WHATSAPP_NUMBER,
  "Halo DR. SHOE, saya ingin konsultasi peluang investor dan franchise DR. SHOE."
);

export function FranchiseCTASection() {
  return (
    <section className="section-tight bg-black text-white">
      <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-normal md:text-5xl">Tertarik Buka Bisnis Shoe Care?</h2>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-neutral-300">
            Jadilah partner DR. SHOE dan bangun peluang bisnis perawatan sepatu di area potensial.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="brand">
            <Link href="/franchise">Ajukan Franchise</Link>
          </Button>
          <Button asChild variant="outline" className="border-white bg-black text-white hover:bg-neutral-900">
            <a href={consultUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Konsultasi Investor
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
