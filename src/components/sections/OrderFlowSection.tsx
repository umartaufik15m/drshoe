import { ClipboardList, MessageCircle, PackageCheck, Send, Sparkles } from "lucide-react";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    icon: ClipboardList,
    title: "Pilih Treatment",
    text: "Pilih layanan sesuai kondisi sepatu."
  },
  {
    icon: Send,
    title: "Pilih Metode Pengiriman",
    text: "Antar langsung, pickup, atau drop point."
  },
  {
    icon: MessageCircle,
    title: "Admin Konfirmasi",
    text: "Tim DR. SHOE akan menghubungi customer melalui WhatsApp."
  },
  {
    icon: Sparkles,
    title: "Sepatu Diproses",
    text: "Sepatu ditangani sesuai treatment yang dipilih."
  },
  {
    icon: PackageCheck,
    title: "Sepatu Siap Diambil",
    text: "Customer akan mendapat update setelah sepatu selesai."
  }
];

export function OrderFlowSection() {
  return (
    <section className="section bg-neutral-100">
      <div className="container">
        <SectionHeading eyebrow="Order Flow" title="Cara Order DR. SHOE" align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-[var(--brand)]">
                  <step.icon size={20} />
                </span>
                <span className="text-3xl font-black text-neutral-200">{index + 1}</span>
              </div>
              <CardTitle className="mt-5 text-lg">{step.title}</CardTitle>
              <CardText>{step.text}</CardText>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
