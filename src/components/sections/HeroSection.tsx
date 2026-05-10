"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BRAND_TAGLINE, CAMPAIGN_PHRASE } from "@/lib/constants";
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

  const activeBanner = slides[active] || slides[0];
  if (!activeBanner) return null;

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
            <img
              src={banner.image_url}
              alt={banner.title}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.62)_38%,rgba(0,0,0,0.15)_72%,rgba(0,0,0,0.55)_100%)]" />
      <div className="graffiti-noise absolute inset-0" />
      <div className="absolute -left-16 top-16 h-40 w-40 rotate-12 border-[18px] border-[#f8e71c] opacity-80" />
      <div className="absolute bottom-10 right-8 hidden rotate-[-8deg] bg-[#00e0ff] px-5 py-2 text-sm font-black uppercase text-black shadow-[8px_8px_0_#ff2f92] md:block">
        DR. SHOE POP CARE
      </div>

      <div className="container relative z-10 flex min-h-[calc(100svh-80px)] items-end pb-12 pt-16 md:pb-16">
        <div className="max-w-4xl">
          <span className="pop-sticker inline-flex items-center gap-2 bg-[#f8e71c] px-4 py-2 text-xs font-black uppercase text-black">
            <Sparkles size={15} />
            {activeBanner.badge_text || CAMPAIGN_PHRASE}
          </span>
          <h1 className="graffiti-title mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-normal text-white md:text-8xl">
            {activeBanner.title}
          </h1>
          <p className="mt-6 max-w-2xl bg-white px-4 py-2 text-base font-black leading-7 text-black md:text-xl">
            {activeBanner.subtitle || BRAND_TAGLINE}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={activeBanner.cta_href || "/booking"}
              className="inline-flex h-12 items-center justify-center gap-2 border-2 border-black bg-[#f8e71c] px-6 text-sm font-black text-black shadow-[6px_6px_0_#ff2f92] transition hover:-translate-y-0.5"
            >
              {activeBanner.cta_label || "Booking Sekarang"} <ArrowRight size={18} />
            </a>
            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 border-2 border-white bg-black/75 px-6 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              <MessageCircle size={18} /> Chat WhatsApp
            </a>
          </div>
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
