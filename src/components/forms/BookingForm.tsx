"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { deliveryMethodLabels, WHATSAPP_NUMBER } from "@/lib/constants";
import {
  calculateBookingPrice,
  EXPRESS_EXCLUDED_SERVICE_SLUGS,
  EXPRESS_SURCHARGE,
  SPECIAL_SHOE_SURCHARGE
} from "@/lib/pricing";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { DropPoint, Service } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import { createBookingMessage, createWhatsAppUrl } from "@/lib/whatsapp";

const schema = z
  .object({
    customer_name: z.string().min(2, "Nama wajib diisi."),
    phone: z.string().min(8, "Nomor WhatsApp wajib diisi."),
    address: z.string().optional(),
    shoe_type: z.string().optional(),
    shoe_material: z.string().optional(),
    quantity: z.coerce.number().min(1, "Jumlah minimal 1 pasang."),
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
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<BookingInput, unknown, BookingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      is_express: false,
      service_slug: defaultService || "",
      delivery_method: defaultDelivery === "drop_point" ? "drop_point" : "direct",
      drop_point_slug: ""
    } as BookingInput
  });

  const deliveryMethod = watch("delivery_method");
  const selectedServiceSlug = watch("service_slug");
  const quantity = watch("quantity");
  const shoeType = watch("shoe_type");
  const shoeMaterial = watch("shoe_material");
  const isExpress = watch("is_express");

  const serviceOptions = useMemo(() => services, [services]);
  const dropPointOptions = useMemo(() => dropPoints, [dropPoints]);
  const selectedService = services.find((item) => item.slug === selectedServiceSlug);
  const isExpressEligible = selectedService
    ? !EXPRESS_EXCLUDED_SERVICE_SLUGS.includes(selectedService.slug)
    : true;
  const pricePreview = calculateBookingPrice({
    servicePrice: selectedService?.price,
    serviceSlug: selectedService?.slug,
    quantity: Number(quantity || 1),
    shoeType,
    shoeMaterial,
    isExpress: Boolean(isExpress) && isExpressEligible
  });

  async function onSubmit(values: BookingValues) {
    if (submitLockRef.current || isSubmitted) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    setNotice(null);

    const service = services.find((item) => item.slug === values.service_slug);
    const dropPoint = dropPoints.find((item) => item.slug === values.drop_point_slug);
    const pricing = calculateBookingPrice({
      servicePrice: service?.price,
      serviceSlug: service?.slug,
      quantity: values.quantity,
      shoeType: values.shoe_type,
      shoeMaterial: values.shoe_material,
      isExpress: values.is_express
    });
    let imageUrl: string | null = null;
    const supabase = createBrowserSupabaseClient();

    try {
      if (supabase && image) {
        const extension = image.name.split(".").pop() || "jpg";
        const path = `orders/${Date.now()}-${values.phone}.${extension}`;
        const upload = await supabase.storage.from("shoe-photos").upload(path, image);
        if (!upload.error) {
          const publicUrl = supabase.storage.from("shoe-photos").getPublicUrl(path);
          imageUrl = publicUrl.data.publicUrl;
        }
      }

      if (supabase) {
        const { error } = await supabase.from("orders").insert({
          customer_name: values.customer_name,
          phone: values.phone,
          address: values.address || null,
          shoe_type: values.shoe_type || null,
          shoe_material: values.shoe_material || null,
          service_id: service?.id || null,
          service_name: service?.name || values.service_slug,
          service_price: service?.price || null,
          quantity: values.quantity,
          surcharge_total: pricing.surchargeTotal,
          is_express: pricing.expressSurchargeTotal > 0,
          express_surcharge_total: pricing.expressSurchargeTotal,
          estimated_total: pricing.total,
          delivery_method: values.delivery_method,
          drop_point_id: dropPoint?.id || null,
          drop_point_name: dropPoint?.name || null,
          image_url: imageUrl,
          notes: values.notes || null
        });
        if (error) throw error;
      }

      const message = createBookingMessage({
        customerName: values.customer_name,
        serviceName: service?.name || values.service_slug,
        quantity: values.quantity,
        shoeType: values.shoe_type,
        shoeMaterial: values.shoe_material,
        deliveryMethod: deliveryMethodLabels[values.delivery_method],
        dropPointName: dropPoint?.name,
        surchargeInfo:
          pricing.surchargeTotal > 0
            ? `${formatRupiah(SPECIAL_SHOE_SURCHARGE)} x ${values.quantity} pasang (${pricing.reasons.join(", ")})`
            : "-",
        expressInfo:
          pricing.expressSurchargeTotal > 0
            ? `${formatRupiah(EXPRESS_SURCHARGE)} x ${values.quantity} pasang`
            : pricing.isExpressEligible
              ? "-"
              : "Tidak tersedia untuk Unyellowing/Repaint",
        estimatedTotal: formatRupiah(pricing.total),
        notes: values.notes
      });
      setWhatsAppUrl(createWhatsAppUrl(WHATSAPP_NUMBER, message));
      setIsSubmitted(true);
      setNotice(
        isSupabaseConfigured
          ? "Booking tersimpan. Lanjutkan ke WhatsApp untuk konfirmasi admin."
          : "Mode demo aktif karena Supabase belum dikonfigurasi. Lanjutkan ke WhatsApp untuk konfirmasi admin."
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
            <Input {...register("customer_name")} placeholder="Nama kamu" />
          </Field>
          <Field label="Nomor WhatsApp" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="08xxxxxxxxxx" />
          </Field>
        </div>

        <Field label="Alamat" error={errors.address?.message}>
          <Input {...register("address")} placeholder="Alamat pickup atau domisili" />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Jenis sepatu" error={errors.shoe_type?.message}>
            <Input {...register("shoe_type")} placeholder="Sneakers, outdoor, running" />
          </Field>
          <Field label="Bahan sepatu" error={errors.shoe_material?.message}>
            <Input {...register("shoe_material")} placeholder="Canvas putih, suede, kulit" />
          </Field>
          <Field label="Jumlah pasang" error={errors.quantity?.message}>
            <Input type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Pilihan layanan" error={errors.service_slug?.message}>
            <Select {...register("service_slug")}>
              <option value="">Pilih layanan</option>
              {serviceOptions.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Metode pengiriman" error={errors.delivery_method?.message}>
            <Select {...register("delivery_method")}>
              <option value="direct">Antar langsung</option>
              <option value="pickup">Pickup</option>
              <option value="drop_point">Drop Point</option>
            </Select>
          </Field>
        </div>

        {deliveryMethod === "drop_point" ? (
          <Field label="Pilih drop point" error={errors.drop_point_slug?.message}>
            <Select {...register("drop_point_slug")}>
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
          <p className="text-sm font-black text-neutral-900">Estimasi biaya</p>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-neutral-700">
            <p>Layanan: {selectedService ? formatRupiah(selectedService.price) : "Pilih layanan dulu"}</p>
            <p>
              Tambahan khusus:{" "}
              {pricePreview.surchargeTotal > 0
                ? `${formatRupiah(SPECIAL_SHOE_SURCHARGE)} x ${Number(quantity || 1)} pasang (${pricePreview.reasons.join(", ")})`
                : `Rp0. Tambahan ${formatRupiah(SPECIAL_SHOE_SURCHARGE)} berlaku untuk sepatu putih, suede, kulit, atau outdoor.`}
            </p>
            <p>
              Cuci ekspres:{" "}
              {!pricePreview.isExpressEligible
                ? "Tidak tersedia untuk layanan ini"
                : pricePreview.expressSurchargeTotal > 0
                  ? `${formatRupiah(EXPRESS_SURCHARGE)} x ${Number(quantity || 1)} pasang`
                  : "Rp0"}
            </p>
            <p className="text-lg font-black text-black">Total estimasi: {formatRupiah(pricePreview.total)}</p>
          </div>
        </div>

        <Field label="Upload foto sepatu">
          <Input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        </Field>

        <Field label="Catatan tambahan" error={errors.notes?.message}>
          <Textarea {...register("notes")} placeholder="Ceritakan kondisi sepatu atau request khusus" />
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
