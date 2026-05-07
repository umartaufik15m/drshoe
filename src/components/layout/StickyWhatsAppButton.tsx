"use client";

import { MessageCircle } from "lucide-react";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";

export function StickyWhatsAppButton() {
  return (
    <a
      href={defaultWhatsAppUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 left-4 right-4 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] text-sm font-black text-black shadow-lg md:hidden"
    >
      <MessageCircle size={18} />
      Tanya DR. SHOE
    </a>
  );
}
