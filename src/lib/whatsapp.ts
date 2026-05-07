import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { ShoeBookingItem } from "@/lib/pricing";

export function createWhatsAppUrl(phone: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function createBookingMessage(data: {
  customerName: string;
  serviceName: string;
  quantity: number;
  shoeType?: string;
  shoeMaterial?: string;
  shoeItems?: ShoeBookingItem[];
  deliveryMethod: string;
  dropPointName?: string;
  surchargeInfo?: string;
  expressInfo?: string;
  estimatedTotal?: string;
  notes?: string;
}) {
  const itemLines = data.shoeItems?.length
    ? data.shoeItems
        .map((item, index) => {
          const materials = [...(item.materials || []), item.otherMaterial].filter(Boolean).join(", ") || "-";
          return `${index + 1}. Jenis: ${item.shoeType || "-"} | Bahan: ${materials} | Warna: ${item.color || "-"}`;
        })
        .join("\n")
    : `Jenis Sepatu: ${data.shoeType || "-"}\nBahan/Warna: ${data.shoeMaterial || "-"}`;

  return `
Halo DR. SHOE, saya ingin booking treatment sepatu.
Nama: ${data.customerName}
Layanan: ${data.serviceName}
Jumlah: ${data.quantity}
Detail Sepatu:
${itemLines}
Metode Pengiriman: ${data.deliveryMethod}
Drop Point: ${data.dropPointName || "-"}
Tambahan Biaya: ${data.surchargeInfo || "-"}
Cuci Ekspres: ${data.expressInfo || "-"}
Estimasi Total: ${data.estimatedTotal || "-"}
Catatan: ${data.notes || "-"}
  `.trim();
}

export function createFranchiseMessage(data: {
  fullName: string;
  city?: string;
  partnershipType: string;
  estimatedCapital?: string;
}) {
  return `
Halo DR. SHOE, saya tertarik untuk mengetahui informasi franchise DR. SHOE.
Nama: ${data.fullName}
Domisili: ${data.city || "-"}
Tipe Kerja Sama: ${data.partnershipType}
Estimasi Modal: ${data.estimatedCapital || "-"}
Mohon kirimkan detail paket, sistem kerja sama, estimasi modal, dan simulasi bisnisnya.
  `.trim();
}

export const defaultWhatsAppUrl = createWhatsAppUrl(
  WHATSAPP_NUMBER,
  "Halo DR. SHOE, saya ingin konsultasi layanan Shoes Laundry & Treatment."
);
