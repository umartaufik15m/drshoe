"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PromoBanner } from "@/lib/types";
import { cn } from "@/lib/utils";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function HeroSection({ banners }: { banners: PromoBanner[] }) {
  const slides = useMemo(() => banners.filter((item) => item.image_url).slice(0, 3), [banners]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  function moveSlide(direction: 1 | -1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {slides.map((banner, index) => (
          <div
            key={`${banner.id || banner.slug || banner.image_url}-${index}`}
            className={cn(
              "absolute inset-0 transition duration-700 ease-out",
              index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
            )}
          >
            <img src={banner.image_url} alt="Banner promo DR. SHOE" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <div className="graffiti-noise absolute inset-0 opacity-25" />

      <div className="container relative z-10 flex min-h-[calc(100svh-80px)] items-end pb-12 md:pb-16">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 border-2 border-black bg-[#f8e71c] px-6 text-sm font-black text-black shadow-[6px_6px_0_#ff2f92] transition hover:-translate-y-0.5"
          >
            Booking Sekarang <ArrowRight size={18} />
          </a>
          <a
            href={defaultWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 border-2 border-white bg-black/75 px-6 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-black"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          <button
            type="button"
            aria-label="Banner sebelumnya"
            className="grid h-11 w-11 place-items-center border-2 border-white bg-black/70 text-white backdrop-blur hover:bg-white hover:text-black"
            onClick={() => moveSlide(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex h-11 items-center gap-2 border-2 border-white bg-black/70 px-3 backdrop-blur">
            {slides.map((banner, index) => (
              <button
                key={`${banner.id || banner.image_url}-dot-${index}`}
                type="button"
                aria-label={`Buka banner ${index + 1}`}
                className={cn(
                  "h-2.5 w-8 transition",
                  index === active ? "bg-[#f8e71c]" : "bg-white/45 hover:bg-white"
                )}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Banner berikutnya"
            className="grid h-11 w-11 place-items-center border-2 border-white bg-black/70 text-white backdrop-blur hover:bg-white hover:text-black"
            onClick={() => moveSlide(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
