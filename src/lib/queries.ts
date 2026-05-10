import {
  fallbackBeforeAfter,
  fallbackDropPoints,
  fallbackPromoBanners,
  fallbackServices,
  fallbackTestimonials
} from "@/lib/data";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { BeforeAfter, DropPoint, PromoBanner, Service, Testimonial } from "@/lib/types";

const dropPointAddressBySlug: Record<string, string> = {
  "kopi-peneleh": "Jl. Pengasinan No.130B, Rawalumbu, Bekasi",
  "coffee-studio": "Jl. Raya Jatiasih, Jatiasih, Bekasi",
  "coffee-studio-matahari": "Jl. Raya Jatiasih, Jatiasih, Bekasi"
};

function withDisplayDropPointAddress(point: DropPoint): DropPoint {
  const name = point.name.toLowerCase();
  const matchedAddress =
    dropPointAddressBySlug[point.slug] ||
    (name.includes("peneleh") ? dropPointAddressBySlug["kopi-peneleh"] : undefined) ||
    (name.includes("studio") || name.includes("matahari") ? dropPointAddressBySlug["coffee-studio"] : undefined);

  return {
    ...point,
    address: point.address || matchedAddress || null
  };
}

function withDisplayBeforeAfterTitle(item: BeforeAfter): BeforeAfter {
  const titleByLegacyTitle: Record<string, string> = {
    "Canvas Refresh": "White Shoes Refresh",
    "Sneakers Daily Wear": "Outdoor Shoes Recovery"
  };

  return {
    ...item,
    title: titleByLegacyTitle[item.title] || item.title
  };
}

export async function getPromoBanners(): Promise<PromoBanner[]> {
  return fallbackPromoBanners;
}

export async function getServices(): Promise<Service[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return fallbackServices;
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return error ? [] : data || [];
}

export async function getDropPoints(): Promise<DropPoint[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return fallbackDropPoints;
  const { data, error } = await supabase.from("drop_points").select("*").eq("is_active", true);
  return error ? [] : (data || []).map((point) => withDisplayDropPointAddress(point));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return fallbackTestimonials;
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return error ? [] : data || [];
}

export async function getBeforeAfter(): Promise<BeforeAfter[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return fallbackBeforeAfter;
  const { data, error } = await supabase
    .from("before_after")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) return fallbackBeforeAfter;

  const items = data || [];
  const hasUploadedImages = items.some((item) => item.before_image_url && item.after_image_url);
  return hasUploadedImages ? items.map((item) => withDisplayBeforeAfterTitle(item)) : fallbackBeforeAfter;
}
