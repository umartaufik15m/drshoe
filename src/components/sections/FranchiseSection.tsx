import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const points = [
  "Brand sudah berjalan",
  "Layanan jelas dan mudah dipahami",
  "Bisa dikembangkan lewat outlet, drop point, coffee shop, komunitas, dan event",
  "Market luas karena sepatu dipakai semua kalangan",
  "Layanan bervariasi: Fast Clean, Deep Clean, Extra Dirty, Repaint, Unyellowing",
  "Cocok untuk investor lokal dan partner area"
];

const franchiseUrl = createWhatsAppUrl(
  WHATSAPP_NUMBER,
  "Halo DR. SHOE, saya tertarik untuk mengetahui informasi franchise DR. SHOE. Mohon kirimkan detail paket, sistem kerja sama, estimasi modal, dan simulasi bisnisnya."
);

export function FranchiseSection() {
  return (
    <section id="franchise" className="section bg-white">
      <div className="container grid items-start gap-10 lg:grid-cols-[0.9fr_1fr]">
        <SectionHeading
          eyebrow="Franchise"
          title="Bangun Bisnis Shoe Care Bareng DR. SHOE"
          subtitle="DR. SHOE membuka peluang franchise untuk investor, partner lokal, pemilik coffee shop, komunitas, dan pelaku usaha yang ingin masuk ke bisnis perawatan sepatu."
        />
        <div className="rounded-[2rem] border border-neutral-200 bg-neutral-100 p-6 md:p-8">
          <p className="text-base leading-8 text-neutral-700">
            Tren penggunaan sneakers terus berkembang dan sepatu sudah menjadi bagian dari lifestyle. Di sisi
            lain, banyak orang belum memahami cara merawat sepatu dengan benar tanpa merusak bahan. DR. SHOE
            hadir sebagai brand Shoes Laundry & Treatment yang menawarkan peluang bisnis dengan layanan yang
            jelas, market yang relevan, dan sistem yang bisa dikembangkan.
          </p>
          <div className="mt-7 grid gap-3">
            {points.map((point) => (
              <p key={point} className="flex gap-3 text-sm font-bold text-neutral-800">
                <CheckCircle2 className="mt-0.5 shrink-0 text-black" size={18} />
                {point}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand">
              <Link href="/franchise">
                Saya Tertarik Franchise <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={franchiseUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Konsultasi Investor
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
