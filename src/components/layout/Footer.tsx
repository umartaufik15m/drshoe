import Link from "next/link";
import { Globe2, Music2 } from "lucide-react";
import { BRAND_NAME, CAMPAIGN_PHRASE, INSTAGRAM_URL, TIKTOK_URL, WORKSHOP_MAPS_URL } from "@/lib/constants";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-black py-12 text-white">
      <div className="container grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black">{BRAND_NAME}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-300">
            Shoes Laundry & Treatment profesional di Bekasi. {CAMPAIGN_PHRASE}.
          </p>
        </div>
        <div>
          <p className="font-black">Menu</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-300">
            <Link href="/booking">Booking</Link>
            <Link href="/status">Cek Status</Link>
            <Link href="/drop-point">Drop Point</Link>
            <Link href="/franchise">Franchise</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
        <div>
          <p className="font-black">Kontak</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-300">
            <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
              WhatsApp Admin
            </a>
            <a href={WORKSHOP_MAPS_URL} target="_blank" rel="noreferrer">
              Maps Workshop
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <Globe2 size={16} /> Instagram
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <Music2 size={16} /> TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
