"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/drop-point", label: "Drop Point" },
  { href: "/franchise", label: "Franchise" },
  { href: "/booking", label: "Booking" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/92 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-sm font-black text-[var(--brand)]">
            DS
          </div>
          <div>
            <p className="text-lg font-black tracking-normal">{BRAND_NAME}</p>
            <p className="hidden text-xs font-semibold text-neutral-500 sm:block">{BRAND_TAGLINE}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-neutral-700 hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="brand">
            <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </Button>
        </div>

        <button
          aria-label="Buka menu"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-neutral-200 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="container grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="brand" className="mt-2">
              <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
