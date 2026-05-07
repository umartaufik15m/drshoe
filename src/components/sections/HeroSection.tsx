import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND_TAGLINE, CAMPAIGN_PHRASE } from "@/lib/constants";

export function HeroSection() {
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

        <div className="relative min-h-[430px]">
          <div className="absolute inset-x-4 top-0 h-[360px] rounded-[2rem] border border-neutral-200 bg-neutral-100 shadow-sm md:inset-x-0">
            <div className="shoe-photo h-full rounded-[2rem]" />
          </div>
          <div className="absolute bottom-0 left-0 w-[58%] rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg">
            <p className="text-xs font-black uppercase text-neutral-500">Before</p>
            <div className="mt-3 h-28 rounded-2xl bg-neutral-200">
              <div className="h-full rounded-2xl bg-[linear-gradient(135deg,#525252,#d4d4d4)] opacity-80" />
            </div>
          </div>
          <div className="absolute bottom-9 right-0 w-[58%] rounded-2xl border-2 border-black bg-[var(--brand)] p-4 shadow-xl">
            <p className="text-xs font-black uppercase text-black">After</p>
            <div className="mt-3 h-28 rounded-2xl bg-white">
              <div className="h-full rounded-2xl bg-[linear-gradient(135deg,#ffffff,#f8e71c)] opacity-90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
