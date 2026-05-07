import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BeforeAfter } from "@/lib/types";

function TreatmentImage({ label, url }: { label: string; url?: string | null }) {
  if (url) {
    return (
      <div
        className="h-44 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}
        aria-label={label}
      />
    );
  }
  return (
    <div className="shoe-photo grid h-44 place-items-end rounded-2xl p-3">
      <span className="rounded-full bg-white px-3 py-1 text-xs font-black">{label}</span>
    </div>
  );
}

export function BeforeAfterSection({ items }: { items: BeforeAfter[] }) {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHeading
          eyebrow="Result"
          title="Hasil Treatment DR. SHOE"
          subtitle="Contoh transformasi treatment. Placeholder siap diganti dengan foto asli dari Supabase Storage."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title}>
              <div className="grid grid-cols-2 gap-3">
                <TreatmentImage label="Before" url={item.before_image_url} />
                <TreatmentImage label="After" url={item.after_image_url} />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-black">{item.title}</h3>
                <Badge>{item.service_name}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
