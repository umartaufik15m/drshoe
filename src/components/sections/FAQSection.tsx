import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    question: "Apakah bisa titip sepatu di kafe?",
    answer: "Bisa. DR. SHOE memiliki drop point resmi di Kopi Peneleh dan Coffee Studio."
  },
  {
    question: "Apakah sepatu tetap dikerjakan oleh DR. SHOE?",
    answer: "Ya. Drop point hanya sebagai titik penitipan. Proses treatment tetap dilakukan oleh tim DR. SHOE."
  },
  {
    question: "Apa saja layanan DR. SHOE?",
    answer: "Fast Clean, Deep Clean, Extra Dirty, Repaint, dan Unyellowing."
  },
  {
    question: "Apakah DR. SHOE membuka franchise?",
    answer:
      "Ya. DR. SHOE membuka peluang franchise, drop point partner, investor partner, dan kolaborasi komunitas atau coffee shop."
  },
  {
    question: "Bagaimana cara booking?",
    answer: "Isi form booking di website, lalu admin akan menghubungi melalui WhatsApp."
  }
];

export function FAQSection() {
  return (
    <section className="section bg-white">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan yang Sering Ditanyakan" />
        <div className="grid gap-4">
          {faqs.map((item) => (
            <Card key={item.question} className="p-5">
              <h3 className="text-lg font-black">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
