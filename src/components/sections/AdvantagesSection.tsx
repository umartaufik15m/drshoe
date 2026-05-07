import { Clock3, Handshake, Headphones, Layers3, ReceiptText, Users } from "lucide-react";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const advantages = [
  {
    icon: Clock3,
    title: "Layanan Express",
    text: "Tersedia opsi pengerjaan cepat sesuai antrean dan kondisi sepatu."
  },
  {
    icon: Headphones,
    title: "Konsultasi Sepatu Gratis",
    text: "Customer bisa konsultasi bahan dan kondisi sepatu sebelum treatment."
  },
  {
    icon: Users,
    title: "Tenaga Berpengalaman",
    text: "Sepatu ditangani oleh tim yang memahami proses cleaning."
  },
  {
    icon: Layers3,
    title: "Jenis Layanan Bervariatif",
    text: "Mulai dari fast clean, deep clean, extra dirty, repaint, sampai unyellowing."
  },
  {
    icon: ReceiptText,
    title: "Harga Bersaing",
    text: "Paket layanan dibuat tetap terjangkau untuk market Bekasi."
  },
  {
    icon: Handshake,
    title: "Tersedia Franchise",
    text: "DR. SHOE membuka peluang kerja sama bisnis untuk partner dan investor."
  }
];

export function AdvantagesSection() {
  return (
    <section className="section bg-black text-white">
      <div className="container">
        <SectionHeading eyebrow="Keunggulan" title="Kenapa Pilih DR. SHOE?" className="[&_h2]:text-white" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <Card key={item.title} className="border-neutral-800 bg-neutral-950 text-white">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)] text-black">
                <item.icon size={22} />
              </span>
              <CardTitle className="mt-5">{item.title}</CardTitle>
              <CardText className="text-neutral-300">{item.text}</CardText>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
