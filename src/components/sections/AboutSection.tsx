import { BadgeCheck, ShieldCheck, Trophy, Wallet, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const highlights = [
  { icon: BadgeCheck, label: "Profesional" },
  { icon: ShieldCheck, label: "Aman untuk bahan sepatu" },
  { icon: Trophy, label: "Berpengalaman" },
  { icon: Wrench, label: "Konsultasi sepatu gratis" },
  { icon: Wallet, label: "Harga bersaing di Bekasi" }
];

export function AboutSection() {
  return (
    <section className="section bg-neutral-100">
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1fr]">
        <SectionHeading eyebrow="Tentang" title="Tentang DR. SHOE" />
        <div>
          <p className="mb-4 text-2xl font-black leading-tight text-black md:text-4xl">
            Shoes Laundry & Treatment profesional di Bekasi.
          </p>
          <p className="text-xl leading-9 text-neutral-700">
            DR. SHOE hadir sebagai solusi untuk pengguna sneakers dan sepatu harian yang ingin menjaga
            sepatu tetap bersih, wangi, dan lebih awet. Dengan cairan pembersih dan tools khusus, setiap
            sepatu ditangani sesuai bahan dan kondisinya.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <Card key={item.label} className="flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--brand)]">
                  <item.icon size={18} />
                </span>
                <p className="text-sm font-black">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
