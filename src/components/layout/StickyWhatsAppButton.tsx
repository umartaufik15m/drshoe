"use client";

import { MessageCircle } from "lucide-react";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function StickyWhatsAppButton() {
  return (
    <a
      href={defaultWhatsAppUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Tanya DR. SHOE lewat WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-[var(--brand)] text-black shadow-[4px_4px_0_#ff2f92] transition hover:-translate-y-0.5 hover:brightness-95"
    >
      <MessageCircle size={24} />
    </a>
  );
}
