"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MessageCircle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { deliveryMethodLabels, WHATSAPP_NUMBER } from "@/lib/constants";
import {
  calculateBookingPrice,
  EXPRESS_EXCLUDED_SERVICE_SLUGS,
  EXPRESS_SURCHARGE,
  SPECIAL_SHOE_SURCHARGE,
  type ShoeBookingItem
} from "@/lib/pricing";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { DropPoint, Service } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import { createBookingMessage, createWhatsAppUrl } from "@/lib/whatsapp";

const materialOptions = [
  { value: "kulit", label: "Kulit" },
  { value: "kanvas", label: "Kanvas" },
  { value: "suede", label: "Suede" },
  { value: "lainnya", label: "Lainnya" }
];

const shoeItemSchema = z.object({
  brand: z.string().min(1, "Merek sepatu wajib diisi."),
  shoeType: z.string().min(1, "Jenis sepatu wajib diisi."),
  materials: z.array(z.string()).optional(),
  otherMaterial: z.string().optional(),
  color: z.string().min(1, "Warna sepatu wajib diisi.")
});

const schema = z
  .object({
    customer_name: z.string().min(2, "Nama wajib diisi."),
    phone: z.string().min(8, "Nomor WhatsApp wajib diisi."),
    address: z.string().optional(),
    shoe_items: z.array(shoeItemSchema).min(1, "Minimal 1 sepatu."),
    is_express: z.preprocess((value) => value === "on" || value === true, z.boolean()).optional(),
    service_slug: z.string().min(1, "Pilih layanan terlebih dahulu."),
    delivery_method: z.enum(["direct", "pickup", "drop_point"], {
      message: "Pilih metode pengiriman."
    }),
    drop_point_slug: z.string().optional(),
    notes: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.delivery_method === "drop_point" && !data.drop_point_slug) {
      ctx.addIssue({
        code: "custom",
        path: ["drop_point_slug"],
        message: "Pilih drop point."
      });
    }
  });

type BookingInput = z.input<typeof schema>;
type BookingValues = z.output<typeof schema>;

function normalizeItems(items: BookingValues["shoe_items"]): ShoeBookingItem[] {
  return items.map((item) => ({
    brand: item.brand,
    shoeType: item.shoeType,
    materials: item.materials || [],
    otherMaterial: item.materials?.includes("lainnya") ? item.otherMaterial || null : null,
    color: item.color
  }));
}

function itemSummary(item: ShoeBookingItem) {
  const materials = [...(item.materials || []), item.otherMaterial].filter(Boolean).join(", ") || "-";
  return `${item.brand || "-"} / ${item.shoeType || "-"} / ${materials} / ${item.color || "-"}`;
}

export function BookingForm({
  services,
  dropPoints,
  defaultService,
  defaultDelivery
}: {
  services: Service[];
  dropPoints: DropPoint[];
  defaultService?: string;
  defaultDelivery?: string;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<BookingInput, unknown, BookingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      phone: "",
      address: "",
      shoe_items: [{ brand: "", shoeType: "", materials: [], otherMaterial: "", color: "" }],
      is_express: false,
      service_slug: defaultService || "",
      delivery_method: defaultDelivery === "drop_point" ? "drop_point" : "direct",
      drop_point_slug: "",
      notes: ""
    } as BookingInput
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shoe_items"
  });

  const deliveryMethod = watch("delivery_method");
  const selectedServiceSlug = watch("service_slug");
  const shoeItems = watch("shoe_items") || [];
  const isExpress = watch("is_express");

  const serviceOptions = useMemo(() => services, [services]);
  const dropPointOptions = useMemo(() => dropPoints, [dropPoints]);
  const selectedService = services.find((item) => item.slug === selectedServiceSlug);
  const isExpressEligible = selectedService
    ? !EXPRESS_EXCLUDED_SERVICE_SLUGS.includes(selectedService.slug)
    : true;
  const normalizedPreviewItems = normalizeItems(shoeItems as BookingValues["shoe_items"]);
  const pricePreview = calculateBookingPrice({
    servicePrice: selectedService?.price,
    serviceSlug: selectedService?.slug,
    quantity: normalizedPreviewItems.length,
    shoeItems: normalizedPreviewItems,
    isExpress: Boolean(isExpress) && isExpressEligible
  });

  async function onSubmit(values: BookingValues) {
    if (submitLockRef.current || isSubmitted) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    setNotice(null);

    const service = services.find((item) => item.slug === values.service_slug);
    const dropPoint = dropPoints.find((item) => item.slug === values.drop_point_slug);
    const bookingItems = normalizeItems(values.shoe_items);
    const pricing = calculateBookingPrice({
      servicePrice: service?.price,
      serviceSlug: service?.slug,
      quantity: bookingItems.length,
      shoeItems: bookingItems,
      isExpress: values.is_express
    });
    let imageUrl: string | null = null;
    let orderImages: string[] = [];
    const supabase = createBrowserSupabaseClient();

    try {
      if (supabase && images.length) {
        const uploadedUrls = await Promise.all(
          images.map(async (file, index) => {
            const extension = file.name.split(".").pop() || "jpg";
            const path = `orders/${Date.now()}-${values.phone}-${index + 1}.${extension}`;
            const upload = await supabase.storage.from("shoe-photos").upload(path, file);
            if (upload.error) return null;
            return supabase.storage.from("shoe-photos").getPublicUrl(path).data.publicUrl;
          })
        );
        orderImages = uploadedUrls.filter(Boolean) as string[];
        if (orderImages.length) {
          imageUrl = orderImages[0];
        }
      }

      const bookingPayload = {
        customer_name: values.customer_name,
        phone: values.phone,
        address: values.address || null,
        shoe_items: bookingItems,
        shoe_type: bookingItems.map((item) => item.shoeType).join(", "),
        shoe_material: bookingItems.map(itemSummary).join(" | "),
        service_id: service?.id || null,
        service_name: service?.name || values.service_slug,
        service_price: service?.price || null,
        quantity: bookingItems.length,
        surcharge_total: pricing.surchargeTotal,
        is_express: pricing.expressSurchargeTotal > 0,
        express_surcharge_total: pricing.expressSurchargeTotal,
        estimated_total: pricing.total,
        delivery_method: values.delivery_method,
        drop_point_id: dropPoint?.id || null,
        drop_point_name: dropPoint?.name || null,
        image_url: imageUrl,
        order_images: orderImages,
        notes: values.notes || null
      };

      if (isSupabaseConfigured) {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingPayload)
        });
        const result = (await response.json()) as { error?: string; warning?: string };
        if (!response.ok) throw new Error(result.error || "Gagal menyimpan booking.");
        if (result.warning) setNotice(result.warning);
      }

      const message = createBookingMessage({
        customerName: values.customer_name,
        serviceName: service?.name || values.service_slug,
        quantity: bookingItems.length,
        shoeItems: bookingItems,
        deliveryMethod: deliveryMethodLabels[values.delivery_method],
        dropPointName: dropPoint?.name,
        surchargeInfo:
          pricing.surchargeTotal > 0
            ? pricing.itemDetails
                .filter((item) => item.surcharge > 0)
                .map((item) => `Sepatu ${item.index}: ${formatRupiah(SPECIAL_SHOE_SURCHARGE)} (${item.reasons.join(", ")})`)
                .join("; ")
            : "-",
        expressInfo:
          pricing.expressSurchargeTotal > 0
            ? `${formatRupiah(EXPRESS_SURCHARGE)} x ${bookingItems.length} pasang`
            : pricing.isExpressEligible
              ? "-"
              : "Tidak tersedia untuk Unyellowing/Repaint",
        estimatedTotal: formatRupiah(pricing.total),
        notes: values.notes
      });
      setWhatsAppUrl(createWhatsAppUrl(WHATSAPP_NUMBER, message));
      setIsSubmitted(true);
      setNotice((current) =>
        current ||
        (isSupabaseConfigured
          ? "Booking tersimpan sebagai satu nota. Lanjutkan ke WhatsApp untuk konfirmasi admin."
          : "Mode demo aktif karena Supabase belum dikonfigurasi. Lanjutkan ke WhatsApp untuk konfirmasi admin.")
      );
    } catch (error) {
      submitLockRef.current = false;
      setNotice(error instanceof Error ? error.message : "Gagal menyimpan booking. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-5 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama lengkap" error={errors.customer_name?.message}>
            <Input {...register("customer_name")} placeholder="Nama kamu" disabled={isSubmitting || isSubmitted} />
          </Field>
          <Field label="Nomor WhatsApp" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="08xxxxxxxxxx" disabled={isSubmitting || isSubmitted} />
          </Field>
        </div>

        <Field label="Alamat" error={errors.address?.message}>
          <Input {...register("address")} placeholder="Alamat pickup atau domisili" disabled={isSubmitting || isSubmitted} />
        </Field>

        <div className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black text-neutral-900">Detail sepatu</p>
              <p className="mt-1 text-sm font-semibold text-neutral-500">
                Satu booking bisa berisi beberapa sepatu dengan bahan dan warna berbeda.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ brand: "", shoeType: "", materials: [], otherMaterial: "", color: "" })}
              disabled={isSubmitting || isSubmitted}
            >
              <Plus size={16} /> Tambah Sepatu
            </Button>
          </div>

          {fields.map((field, index) => {
            const currentMaterials = shoeItems[index]?.materials || [];
            return (
              <div key={field.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-black">Sepatu {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1 || isSubmitting || isSubmitted}
                  >
                    <Trash2 size={16} /> Hapus
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Merek sepatu" error={errors.shoe_items?.[index]?.brand?.message}>
                    <Input
                      {...register(`shoe_items.${index}.brand`)}
                      placeholder="Nike, Adidas, Converse"
                      disabled={isSubmitting || isSubmitted}
                    />
                  </Field>
                  <Field label="Jenis sepatu" error={errors.shoe_items?.[index]?.shoeType?.message}>
                    <Input
                      {...register(`shoe_items.${index}.shoeType`)}
                      placeholder="Sneakers, outdoor, running"
                      disabled={isSubmitting || isSubmitted}
                    />
                  </Field>
                  <Field label="Warna sepatu" error={errors.shoe_items?.[index]?.color?.message}>
                    <Input
                      {...register(`shoe_items.${index}.color`)}
                      placeholder="Putih, hitam, cream, navy"
                      disabled={isSubmitting || isSubmitted}
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-bold text-neutral-900">Bahan sepatu</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {materialOptions.map((material) => (
                      <label
                        key={material.value}
                        className="flex items-center gap-2 rounded-2xl border border-neutral-200 px-3 py-2 text-sm font-bold text-neutral-700"
                      >
                        <input
                          type="checkbox"
                          value={material.value}
                          {...register(`shoe_items.${index}.materials`)}
                          className="h-4 w-4 accent-black"
                          disabled={isSubmitting || isSubmitted}
                        />
                        {material.label}
                      </label>
                    ))}
                  </div>
                  {currentMaterials.includes("lainnya") ? (
                    <div className="mt-3">
                      <Input
                        {...register(`shoe_items.${index}.otherMaterial`)}
                        placeholder="Tulis bahan lainnya"
                        disabled={isSubmitting || isSubmitted}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Pilihan layanan" error={errors.service_slug?.message}>
            <Select {...register("service_slug")} disabled={isSubmitting || isSubmitted}>
              <option value="">Pilih layanan</option>
              {serviceOptions.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Metode pengiriman" error={errors.delivery_method?.message}>
            <Select {...register("delivery_method")} disabled={isSubmitting || isSubmitted}>
              <option value="direct">Antar langsung</option>
              <option value="pickup">Pickup</option>
              <option value="drop_point">Drop Point</option>
            </Select>
          </Field>
        </div>

        {deliveryMethod === "drop_point" ? (
          <Field label="Pilih drop point" error={errors.drop_point_slug?.message}>
            <Select {...register("drop_point_slug")} disabled={isSubmitting || isSubmitted}>
              <option value="">Pilih lokasi</option>
              {dropPointOptions.map((point) => (
                <option key={point.slug} value={point.slug}>
                  {point.name}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <input
            type="checkbox"
            {...register("is_express")}
            className="mt-1 h-5 w-5 shrink-0 accent-black"
            disabled={isSubmitting || isSubmitted || !isExpressEligible}
          />
          <span>
            <span className="block text-sm font-black text-neutral-900">Cuci ekspres</span>
            <span className="mt-1 block text-sm font-semibold leading-6 text-neutral-600">
              {isExpressEligible
                ? `Tambahan ${formatRupiah(EXPRESS_SURCHARGE)} per pasang untuk pengerjaan lebih cepat sesuai antrean dan kondisi sepatu.`
                : "Tidak tersedia untuk layanan Unyellowing dan Repaint."}
            </span>
          </span>
        </label>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-4">
          <p className="text-sm font-black text-neutral-900">Estimasi nota</p>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-neutral-700">
            <p>
              Layanan: {selectedService ? `${formatRupiah(selectedService.price)} x ${pricePreview.quantity} pasang` : "Pilih layanan dulu"}
            </p>
            <p>
              Tambahan khusus:{" "}
              {pricePreview.surchargeTotal > 0
                ? `${formatRupiah(pricePreview.surchargeTotal)} (${pricePreview.reasons.join(", ")})`
                : `Rp0. Tambahan ${formatRupiah(SPECIAL_SHOE_SURCHARGE)} berlaku per sepatu untuk warna putih, bahan suede/kulit, atau jenis outdoor.`}
            </p>
            <p>
              Cuci ekspres:{" "}
              {!pricePreview.isExpressEligible
                ? "Tidak tersedia untuk layanan ini"
                : pricePreview.expressSurchargeTotal > 0
                  ? `${formatRupiah(EXPRESS_SURCHARGE)} x ${pricePreview.quantity} pasang`
                  : "Rp0"}
            </p>
            <p className="text-lg font-black text-black">Total estimasi: {formatRupiah(pricePreview.total)}</p>
          </div>
        </div>

        <Field label="Upload foto sepatu">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setImages(Array.from(event.target.files || []))}
            disabled={isSubmitting || isSubmitted}
          />
          {images.length ? (
            <p className="mt-2 text-sm font-semibold text-neutral-500">{images.length} foto dipilih.</p>
          ) : null}
        </Field>

        <Field label="Catatan tambahan" error={errors.notes?.message}>
          <Textarea
            {...register("notes")}
            placeholder="Ceritakan kondisi sepatu atau request khusus"
            disabled={isSubmitting || isSubmitted}
          />
        </Field>

        {notice ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-sm font-bold text-neutral-800">
            {notice}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="brand" disabled={isSubmitting || isSubmitted}>
            {isSubmitting ? "Menyimpan..." : isSubmitted ? "Booking Terkirim" : "Submit Booking"}{" "}
            <ArrowRight size={16} />
          </Button>
          {whatsAppUrl ? (
            <Button asChild variant="outline">
              <a href={whatsAppUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Lanjut ke WhatsApp
              </a>
            </Button>
          ) : null}
          {whatsAppUrl ? (
            <Button asChild variant="ghost">
              <Link href="/status">Cek Status Booking</Link>
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
