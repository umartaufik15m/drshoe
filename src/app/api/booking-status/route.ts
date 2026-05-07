import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function phoneVariants(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const variants = new Set<string>();
  if (phone.trim()) variants.add(phone.trim());
  if (digits) variants.add(digits);
  if (digits.startsWith("0")) variants.add(`62${digits.slice(1)}`);
  if (digits.startsWith("62")) variants.add(`0${digits.slice(2)}`);
  return Array.from(variants);
}

export async function POST(request: Request) {
  const { phone } = (await request.json().catch(() => ({}))) as { phone?: string };
  const digits = (phone || "").replace(/\D/g, "");

  if (digits.length < 8) {
    return NextResponse.json({ error: "Masukkan nomor WhatsApp yang valid." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di server." }, { status: 500 });
  }

  const selectColumns =
    "id, customer_name, phone, service_name, quantity, delivery_method, drop_point_name, status, created_at, updated_at";
  const variants = phoneVariants(phone || "");
  let { data, error } = await supabase
    .from("orders")
    .select(selectColumns)
    .in("phone", variants)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!error && (!data || data.length === 0)) {
    const lastDigits = digits.slice(-8);
    const fallback = await supabase
      .from("orders")
      .select(selectColumns)
      .ilike("phone", `%${lastDigits}%`)
      .order("created_at", { ascending: false })
      .limit(10);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data || [] });
}
