"use client";

import { ImageUp, Pencil, Power, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { PromoBanner } from "@/lib/types";

type BannerForm = {
  id?: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm: BannerForm = {
  image_url: "",
  sort_order: 1,
  is_active: true
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toForm(item: PromoBanner, index: number): BannerForm {
  return {
    id: item.id,
    image_url: item.image_url,
    sort_order: item.sort_order ?? index + 1,
    is_active: item.is_active ?? true
  };
}

export function BannerManager() {
  const [items, setItems] = useState<PromoBanner[]>([]);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Mode demo: isi env Supabase untuk mengelola banner live.");
      return;
    }
    const { data, error } = await supabase
      .from("promo_banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      setNotice(error.message);
      return;
    }
    const banners = (data || []) as PromoBanner[];
    setItems(banners);
    setForm((current) => ({
      ...current,
      sort_order: current.id ? current.sort_order : Math.min(banners.length + 1, 3)
    }));
  }

  async function saveBanner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      return;
    }
    if (!form.id && items.length >= 3) {
      setNotice("Maksimal 3 banner. Ganti salah satu gambar banner yang sudah ada.");
      return;
    }
    if (!imageFile) {
      setNotice("Pilih gambar banner dari galeri dulu.");
      return;
    }

    setSaving(true);
    setNotice(null);

    const extension = imageFile.name.split(".").pop() || "jpg";
    const cleanName = slugify(imageFile.name.replace(/\.[^.]+$/, "")) || "banner";
    const path = `slides/${Date.now()}-${cleanName}.${extension}`;
    const upload = await supabase.storage.from("promo-banners").upload(path, imageFile, {
      upsert: true
    });
    if (upload.error) {
      setNotice(upload.error.message);
      setSaving(false);
      return;
    }

    const imageUrl = supabase.storage.from("promo-banners").getPublicUrl(path).data.publicUrl;
    const slideNumber = form.id ? form.sort_order : Math.min(items.length + 1, 3);

    const result = form.id
      ? await supabase
          .from("promo_banners")
          .update({ image_url: imageUrl, updated_at: new Date().toISOString() } as never)
          .eq("id", form.id)
      : await supabase.from("promo_banners").insert({
          slug: `banner-${Date.now()}`,
          title: `Banner ${slideNumber}`,
          image_url: imageUrl,
          cta_label: "Booking Sekarang",
          cta_href: "/booking",
          sort_order: slideNumber,
          is_active: true
        } as never);

    if (result.error) {
      setNotice(result.error.message);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setImageFile(null);
    setSaving(false);
    setNotice(form.id ? "Gambar banner berhasil diganti." : "Banner berhasil diupload.");
    await load();
  }

  async function toggleActive(item: PromoBanner) {
    if (!item.id) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const next = !(item.is_active ?? true);
    const activeCount = items.filter((banner) => banner.is_active !== false).length;
    if (next && activeCount >= 3) {
      setNotice("Maksimal 3 banner aktif.");
      return;
    }
    const { error } = await supabase
      .from("promo_banners")
      .update({ is_active: next, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setItems((current) =>
      current.map((banner) => (banner.id === item.id ? { ...banner, is_active: next } : banner))
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6">
      <Card className="border-black bg-[#f8e71c] p-5 shadow-[8px_8px_0_#111]">
        <p className="text-xs font-black uppercase text-black">Promo Banner</p>
        <h1 className="mt-1 text-3xl font-black uppercase text-black">Upload Slide Banner</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold text-black/75">
          Upload maksimal 3 gambar banner aktif. Resolusi ideal 1920 x 900 px atau 1920 x 1080 px.
        </p>
        {notice ? <p className="mt-3 text-sm font-black text-black">{notice}</p> : null}
      </Card>

      <Card className="p-5">
        <form onSubmit={saveBanner} className="grid gap-4">
          <Field label={form.id ? "Ganti gambar banner" : "Upload gambar banner"}>
            <Input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </Field>
          <div className="overflow-hidden border-2 border-black bg-neutral-100">
            {form.image_url ? (
              <img src={form.image_url} alt="Preview banner" className="h-52 w-full object-cover" />
            ) : (
              <div className="grid h-52 place-items-center text-sm font-black text-neutral-500">
                <span className="inline-flex items-center gap-2">
                  <ImageUp size={24} /> Preview banner
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="brand" disabled={saving || (!form.id && items.length >= 3)}>
              <Save size={17} /> {form.id ? "Simpan Gambar" : "Upload Banner"}
            </Button>
            {form.id ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm({ ...emptyForm, sort_order: Math.min(items.length + 1, 3) });
                  setImageFile(null);
                }}
              >
                <X size={17} /> Batal
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Slide</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || item.slug || item.image_url} className="border-t border-neutral-200">
                  <td className="p-4">
                    <img
                      src={item.image_url}
                      alt={`Banner ${index + 1}`}
                      className="h-20 w-40 border border-neutral-200 object-cover"
                    />
                  </td>
                  <td className="p-4 font-black">Banner {index + 1}</td>
                  <td className="p-4">{item.is_active === false ? "Inactive" : "Active"}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setForm(toForm(item, index))}>
                        <Pencil size={15} /> Ganti
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => toggleActive(item)}>
                        <Power size={15} /> Toggle
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td className="p-5 text-sm font-bold text-neutral-500" colSpan={4}>
                    Belum ada banner. Upload maksimal 3 gambar untuk slide utama.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
