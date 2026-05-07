"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { partnershipTypeLabels, WHATSAPP_NUMBER } from "@/lib/constants";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { createFranchiseMessage, createWhatsAppUrl } from "@/lib/whatsapp";

const schema = z.object({
  full_name: z.string().min(2, "Nama wajib diisi."),
  phone: z.string().min(8, "Nomor WhatsApp wajib diisi."),
  city: z.string().optional(),
  has_location: z.preprocess((value) => value === "true" || value === true, z.boolean()).optional(),
  estimated_capital: z.string().optional(),
  partnership_type: z.enum(
    ["franchise_outlet", "drop_point_partner", "investor_partner", "coffee_shop_community_collab"],
    { message: "Pilih tipe kerja sama." }
  ),
  notes: z.string().optional()
});

type FranchiseInput = z.input<typeof schema>;
type FranchiseValues = z.output<typeof schema>;

export function FranchiseInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FranchiseInput, unknown, FranchiseValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partnership_type: "franchise_outlet",
      has_location: false
    } as FranchiseInput
  });

  async function onSubmit(values: FranchiseValues) {
    setIsSubmitting(true);
    setNotice(null);
    try {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("franchise_inquiries").insert(values);
        if (error) throw error;
      }

      const message = createFranchiseMessage({
        fullName: values.full_name,
        city: values.city,
        partnershipType: partnershipTypeLabels[values.partnership_type],
        estimatedCapital: values.estimated_capital
      });
      setWhatsAppUrl(createWhatsAppUrl(WHATSAPP_NUMBER, message));
      setNotice(
        isSupabaseConfigured
          ? "Inquiry franchise tersimpan. Lanjutkan ke WhatsApp untuk konsultasi."
          : "Mode demo aktif karena Supabase belum dikonfigurasi. Lanjutkan ke WhatsApp untuk konsultasi."
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Gagal menyimpan inquiry. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-5 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama lengkap" error={errors.full_name?.message}>
            <Input {...register("full_name")} placeholder="Nama kamu" />
          </Field>
          <Field label="Nomor WhatsApp" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="08xxxxxxxxxx" />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Domisili" error={errors.city?.message}>
            <Input {...register("city")} placeholder="Bekasi, Jakarta, Bandung" />
          </Field>
          <Field label="Estimasi modal" error={errors.estimated_capital?.message}>
            <Input {...register("estimated_capital")} placeholder="Contoh: 20-50 juta" />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Apakah sudah punya lokasi?">
            <Select {...register("has_location")}>
              <option value="false">Belum</option>
              <option value="true">Sudah</option>
            </Select>
          </Field>
          <Field label="Tipe kerja sama" error={errors.partnership_type?.message}>
            <Select {...register("partnership_type")}>
              {Object.entries(partnershipTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Catatan tambahan" error={errors.notes?.message}>
          <Textarea {...register("notes")} placeholder="Ceritakan target area, lokasi, atau rencana kolaborasi" />
        </Field>
        {notice ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-sm font-bold text-neutral-800">
            {notice}
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="brand" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Submit Inquiry"} <ArrowRight size={16} />
          </Button>
          {whatsAppUrl ? (
            <Button asChild variant="outline">
              <a href={whatsAppUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> WhatsApp Konsultasi
              </a>
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
