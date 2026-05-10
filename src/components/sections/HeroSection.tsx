"use client";

import { useEffect, useMemo, useState } from "react";
import type { PromoBanner } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  return (
    <section className="relative overflow-hidden bg-black text-white md:min-h-[calc(100svh-80px)]">
      <div className="relative aspect-[6/5] w-full overflow-hidden bg-black md:absolute md:inset-0 md:aspect-auto md:h-full">
        {slides.map((banner, index) => (
          <div
            key={`${banner.id || banner.slug || banner.image_url}-${index}`}
            className={cn(
              "absolute inset-0 transition duration-700 ease-out",
              index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
            )}
          >
            <picture className="block h-full w-full">
              <source media="(max-width: 767px)" srcSet={banner.mobile_image_url || banner.image_url} />
              <img
                src={banner.image_url}
                alt="Banner promo DR. SHOE"
                className="h-full w-full object-contain md:object-cover"
              />
            </picture>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:block" />
      <div className="graffiti-noise absolute inset-0 hidden opacity-25 md:block" />

    </section>
  );
}
