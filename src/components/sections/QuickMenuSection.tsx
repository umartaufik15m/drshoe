import Link from "next/link";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { ShoeWashIcon } from "@/components/icons/ShoeWashIcon";
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
              const isHome = item.label === "Home";
              const isService = item.label === "Layanan";
              const isBooking = item.label === "Booking";
              const Icon = isHome ? CalendarCheck : isService ? ShoeWashIcon : isBooking ? MessageCircle : item.icon;
              const href = isHome ? "/booking" : item.href;
              const targetHref = isBooking ? defaultWhatsAppUrl : href;
              const label = isHome ? "Booking Sekarang" : isBooking ? "Konsultasi" : item.label;
              const content = (
                <>
                  <span className="relative mx-auto grid h-16 w-16 place-items-center">
                    <span
                      className={cn(
                        "absolute h-11 w-11 rounded-full transition group-hover:scale-110",
                        isHome ? "bg-black" : "bg-[var(--brand)]"
                      )}
                    />
                    <Icon className={cn("relative z-10 h-9 w-9", isHome ? "text-[var(--brand)]" : "text-black")} />
                  </span>
                  <span
                    className={cn(
                      "mt-3 block text-sm font-black uppercase leading-tight",
                      isHome ? "text-black" : "text-black"
                    )}
                  >
                    {label}
                  </span>
                </>
              );
              const className = cn(
                "group min-h-32 rounded-[1.15rem] border p-4 text-center transition hover:-translate-y-1",
                isHome
                  ? "border-black bg-[var(--brand)] shadow-[5px_5px_0_#111] hover:shadow-[5px_5px_0_#ff2f92]"
                  : "border-neutral-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:border-black hover:shadow-[0_16px_32px_rgba(0,0,0,0.14)]"
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
