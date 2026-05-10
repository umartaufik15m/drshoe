import Link from "next/link";
import { CalendarCheck, CircleDollarSign, MessageCircle } from "lucide-react";
import { navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function QuickMenuSection() {
  return (
    <section className="relative z-20 bg-neutral-50 px-0 pb-6 md:-mt-14 md:bg-transparent md:pb-10">
      <div className="container">
        <div className="rounded-[1.5rem] border border-neutral-100 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.12)] md:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {navItems.map((item) => {
              const isHome = item.href === "/";
              const isService = item.href === "/#layanan";
              const isBooking = item.href === "/booking";
              const Icon = isHome ? CalendarCheck : isService ? CircleDollarSign : isBooking ? MessageCircle : item.icon;
              const href = isHome ? "/booking" : item.href;
              const targetHref = isBooking ? defaultWhatsAppUrl : href;
              const label = isHome ? "Booking" : isService ? "Harga & Layanan" : isBooking ? "Konsultasi" : item.label;
              const content = (
                <>
                  <span className="relative mx-auto grid h-14 w-14 place-items-center">
                    <span className="absolute right-1 top-1 h-9 w-9 rounded-full bg-[var(--brand)] transition group-hover:scale-110" />
                    <Icon className="relative z-10 h-8 w-8 text-black" />
                  </span>
                  <span className="mt-3 block text-sm font-black uppercase leading-tight text-black">
                    {label}
                  </span>
                </>
              );
              const className = cn(
                "group min-h-28 rounded-[1.15rem] border-2 border-[var(--brand)] bg-white p-4 text-center shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:border-black hover:shadow-[0_16px_32px_rgba(0,0,0,0.13)]"
              );

              return isBooking ? (
                <a
                  key={`${item.href}-${label}`}
                  href={targetHref}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link key={`${item.href}-${label}`} href={targetHref} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
