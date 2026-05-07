import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND_TAGLINE, CAMPAIGN_PHRASE } from "@/lib/constants";

export function HeroSection() {
  const heroBefore = "/images/hero-before.png";
  const heroAfter = "/images/hero-after.png";

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge className="mb-5 bg-yellow-200 text-black">
            <Sparkles size={14} />
            {CAMPAIGN_PHRASE}
          </Badge>
          <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-normal text-black md:text-7xl">
            Sepatu Kotor? Serahkan ke Dokternya.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            DR. SHOE adalah layanan Shoes Laundry & Treatment profesional di Bekasi untuk membersihkan,
            merawat, dan mengembalikan tampilan sepatu favoritmu.
          </p>
          <p className="mt-4 text-sm font-black uppercase text-neutral-900">{BRAND_TAGLINE}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/booking">
                Booking Sekarang <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/franchise">Lihat Franchise</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-bold text-neutral-700 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={18} /> Profesional
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={18} /> Aman untuk bahan
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} /> Bekasi
            </span>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-neutral-200 bg-neutral-100 p-4 shadow-sm sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white p-3 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase text-neutral-500">Before</p>
            <img
              src={heroBefore}
              alt="Sepatu sebelum treatment DR. SHOE"
              className="h-72 w-full rounded-[1.25rem] object-cover"
            />
          </div>
          <div className="rounded-[1.5rem] border-2 border-black bg-[var(--brand)] p-3 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase text-black">After</p>
            <img
              src={heroAfter}
              alt="Sepatu setelah treatment DR. SHOE"
              className="h-72 w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
