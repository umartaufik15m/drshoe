"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { navItems } from "@/lib/navigation";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

const logoUrl = "/images/main logo.jpeg";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-white/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="DR. SHOE"
            className="h-12 w-12 rotate-[-3deg] rounded-2xl border-2 border-black bg-[var(--brand)] object-contain p-1 shadow-[4px_4px_0_#00e0ff]"
          />
          <div>
            <p className="text-lg font-black uppercase tracking-normal">{BRAND_NAME}</p>
            <p className="hidden text-xs font-semibold text-neutral-500 sm:block">{BRAND_TAGLINE}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-black uppercase text-neutral-700 after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:bg-[#ff2f92] after:transition-all hover:text-black hover:after:w-full"
            >
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
          className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0_#f8e71c] lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t-2 border-black bg-white lg:hidden">
          <div className="container grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-black uppercase hover:border-black hover:bg-[var(--brand)]"
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
