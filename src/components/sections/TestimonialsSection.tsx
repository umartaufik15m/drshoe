import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="section bg-neutral-100">
      <div className="container">
        <SectionHeading eyebrow="Testimonials" title="Kata Mereka Setelah Treatment" align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={`${item.customer_name}-${item.service_name}`}>
              <div className="flex items-center gap-1 text-[var(--brand)]">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-base leading-7 text-neutral-700">"{item.comment}"</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="font-black">{item.customer_name}</p>
                <Badge>{item.service_name}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
