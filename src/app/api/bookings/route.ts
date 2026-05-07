import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type BookingPayload = {
  customer_name: string;
  phone: string;
  address?: string | null;
  shoe_items?: unknown;
  shoe_type?: string | null;
  shoe_material?: string | null;
  service_id?: string | null;
  service_name?: string | null;
  service_price?: number | null;
  quantity?: number;
  surcharge_total?: number;
  is_express?: boolean;
  express_surcharge_total?: number;
  estimated_total?: number;
  delivery_method?: string;
  drop_point_id?: string | null;
  drop_point_name?: string | null;
  image_url?: string | null;
  notes?: string | null;
};

function legacyPayload(payload: BookingPayload) {
  const details = [
    payload.notes,
    payload.estimated_total ? `Estimasi total: ${payload.estimated_total}` : null,
    payload.surcharge_total ? `Tambahan khusus: ${payload.surcharge_total}` : null,
    payload.express_surcharge_total ? `Tambahan ekspres: ${payload.express_surcharge_total}` : null
  ]
    .filter(Boolean)
    .join("\n");

  return {
    customer_name: payload.customer_name,
    phone: payload.phone,
    address: payload.address || null,
    shoe_type: payload.shoe_type || null,
    shoe_material: payload.shoe_material || null,
    service_id: payload.service_id || null,
    service_name: payload.service_name || null,
    quantity: payload.quantity || 1,
    delivery_method: payload.delivery_method || "direct",
    drop_point_id: payload.drop_point_id || null,
    drop_point_name: payload.drop_point_name || null,
    image_url: payload.image_url || null,
    notes: details || null
  };
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as BookingPayload | null;

  if (!payload?.customer_name || !payload.phone) {
    return NextResponse.json({ error: "Nama dan nomor WhatsApp wajib diisi." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum aktif di server." }, { status: 500 });
  }

  const fullInsert = await supabase.from("orders").insert(payload).select("id").single();
  if (!fullInsert.error) {
    return NextResponse.json({ id: fullInsert.data.id });
  }

  const shouldTryLegacy =
    fullInsert.error.message.includes("schema cache") ||
    fullInsert.error.message.includes("column") ||
    fullInsert.error.message.includes("Could not find");

  if (!shouldTryLegacy) {
    return NextResponse.json({ error: fullInsert.error.message }, { status: 500 });
  }

  const fallbackInsert = await supabase.from("orders").insert(legacyPayload(payload)).select("id").single();
  if (fallbackInsert.error) {
    return NextResponse.json({ error: fallbackInsert.error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: fallbackInsert.data.id,
    warning: "Order tersimpan dengan format kompatibel. Jalankan semua SQL migration untuk menyimpan rincian nota lengkap."
  });
}
