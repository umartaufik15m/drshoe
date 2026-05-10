"use client";

import { ImageUp, Pencil, Power, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { PromoBanner } from "@/lib/types";

type BannerForm = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  badge_text: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  sort_order: string;
  is_active: boolean;
};

const emptyForm: BannerForm = {
  slug: "",
  title: "",
  subtitle: "",
  badge_text: "",
  image_url: "",
  cta_label: "Booking Sekarang",
  cta_href: "/booking",
  sort_order: "1",
  is_active: true
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toForm(item: PromoBanner): BannerForm {
  return {
    id: item.id,
    slug: item.slug || "",
    title: item.title,
    subtitle: item.subtitle || "",
    badge_text: item.badge_text || "",
    image_url: item.image_url,
    cta_label: item.cta_label || "",
    cta_href: item.cta_href || "",
    sort_order: String(item.sort_order ?? 1),
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
    setItems((data || []) as PromoBanner[]);
  }

  async function saveBanner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      return;
    }
    if (!form.id && items.length >= 3) {
      setNotice("Maksimal 3 banner. Edit banner yang sudah ada kalau ingin mengganti promo.");
      return;
    }

    setSaving(true);
    setNotice(null);

    let imageUrl = form.image_url;
    if (imageFile) {
      const extension = imageFile.name.split(".").pop() || "jpg";
      const path = `slides/${Date.now()}-${slugify(imageFile.name.replace(/\.[^.]+$/, "")) || "banner"}.${extension}`;
      const upload = await supabase.storage.from("promo-banners").upload(path, imageFile, {
        upsert: true
      });
      if (upload.error) {
        setNotice(upload.error.message);
        setSaving(false);
        return;
      }
      imageUrl = supabase.storage.from("promo-banners").getPublicUrl(path).data.publicUrl;
    }

    if (!imageUrl) {
      setNotice("Upload gambar banner atau isi URL gambar dulu.");
      setSaving(false);
      return;
    }

    const payload = {
      slug: form.slug || slugify(form.title) || `banner-${Date.now()}`,
      title: form.title,
      subtitle: form.subtitle || null,
      badge_text: form.badge_text || null,
      image_url: imageUrl,
      cta_label: form.cta_label || null,
      cta_href: form.cta_href || null,
      sort_order: Number(form.sort_order || 0),
      is_active: form.is_active,
      updated_at: new Date().toISOString()
    };

    const result = form.id
      ? await supabase.from("promo_banners").update(payload as never).eq("id", form.id)
      : await supabase.from("promo_banners").insert(payload as never);

    if (result.error) {
      setNotice(result.error.message);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setImageFile(null);
    setSaving(false);
    setNotice(form.id ? "Banner berhasil diperbarui." : "Banner berhasil ditambahkan.");
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
        <h1 className="mt-1 text-3xl font-black uppercase text-black">Kelola Slide Banner</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold text-black/75">
          Maksimal 3 slide aktif. Resolusi ideal 1920 x 900 px atau 1920 x 1080 px, format JPG/WEBP/PNG.
        </p>
        {notice ? <p className="mt-3 text-sm font-black text-black">{notice}</p> : null}
      </Card>

      <Card className="p-5">
        <form onSubmit={saveBanner} className="grid gap-4 md:grid-cols-2">
          <Field label="Judul banner">
            <Input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Fresh Kicks, Fresh Move"
              required
            />
          </Field>
          <Field label="Label kecil">
            <Input
              value={form.badge_text}
              onChange={(event) => setForm({ ...form, badge_text: event.target.value })}
              placeholder="Promo Drop"
            />
          </Field>
          <Field label="Teks tombol">
            <Input
              value={form.cta_label}
              onChange={(event) => setForm({ ...form, cta_label: event.target.value })}
              placeholder="Booking Sekarang"
            />
          </Field>
          <Field label="Link tombol">
            <Input
              value={form.cta_href}
              onChange={(event) => setForm({ ...form, cta_href: event.target.value })}
              placeholder="/booking"
            />
          </Field>
          <Field label="Urutan slide">
            <Input
              type="number"
              min={1}
              max={3}
              value={form.sort_order}
              onChange={(event) => setForm({ ...form, sort_order: event.target.value })}
            />
          </Field>
          <Field label="Slug">
            <Input
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              placeholder="promo-drop"
            />
          </Field>
          <Field label="URL gambar banner">
            <Input
              value={form.image_url}
              onChange={(event) => setForm({ ...form, image_url: event.target.value })}
              placeholder="https://..."
            />
          </Field>
          <Field label="Upload gambar banner">
            <Input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Subtitle">
              <Textarea
                value={form.subtitle}
                onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
                placeholder="Promo singkat yang tampil di atas banner."
              />
            </Field>
          </div>
          {(form.image_url || imageFile) ? (
            <div className="md:col-span-2">
              <div className="overflow-hidden border-2 border-black bg-neutral-100">
                {form.image_url ? (
                  <img src={form.image_url} alt="Preview banner" className="h-48 w-full object-cover" />
                ) : (
                  <div className="grid h-48 place-items-center text-sm font-black text-neutral-500">
                    <ImageUp size={24} />
                    Gambar siap diupload saat disimpan
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit" variant="brand" disabled={saving || (!form.id && items.length >= 3)}>
              <Save size={17} /> {form.id ? "Simpan Perubahan" : "Tambah Banner"}
            </Button>
            {form.id ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setImageFile(null);
                }}
              >
                <X size={17} /> Batal Edit
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Banner</th>
                <th className="p-4">Urutan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id || item.slug || item.title} className="border-t border-neutral-200">
                  <td className="p-4">
                    <img src={item.image_url} alt={item.title} className="h-20 w-36 border border-neutral-200 object-cover" />
                  </td>
                  <td className="p-4">
                    <p className="font-black">{item.title}</p>
                    <p className="mt-1 max-w-md text-xs font-semibold text-neutral-500">{item.subtitle || "-"}</p>
                  </td>
                  <td className="p-4 font-black">{item.sort_order ?? "-"}</td>
                  <td className="p-4">{item.is_active === false ? "Inactive" : "Active"}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setForm(toForm(item))}>
                        <Pencil size={15} /> Edit
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
                  <td className="p-5 text-sm font-bold text-neutral-500" colSpan={5}>
                    Belum ada banner. Tambahkan maksimal 3 slide untuk promo utama.
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
