"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { fallbackDropPoints, fallbackServices, fallbackTestimonials } from "@/lib/data";
import { formatRupiah } from "@/lib/utils";

type ManagerKind = "services" | "drop_points" | "testimonials";
type ContentRow = Record<string, string | number | boolean | null | undefined> & { id?: string };

const fallbackByKind: Record<ManagerKind, ContentRow[]> = {
  services: fallbackServices,
  drop_points: fallbackDropPoints,
  testimonials: fallbackTestimonials
};

const titleByKind: Record<ManagerKind, string> = {
  services: "Services",
  drop_points: "Drop Points",
  testimonials: "Testimonials"
};

export function ContentManager({ kind }: { kind: ManagerKind }) {
  const [items, setItems] = useState<ContentRow[]>(fallbackByKind[kind]);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<ContentRow>({});

  async function load() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Mode demo: isi env Supabase untuk mengelola data live.");
      return;
    }
    const { data, error } = await supabase.from(kind).select("*");
    if (error) {
      setNotice(error.message);
      return;
    }
    setItems((data || []) as ContentRow[]);
  }

  async function toggleActive(item: ContentRow) {
    if (!item.id) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const next = !(item.is_active ?? true);
    const { error } = await supabase.from(kind).update({ is_active: next }).eq("id", item.id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_active: next } : row)));
  }

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      return;
    }
    const payload =
      kind === "services"
        ? {
            name: form.name,
            slug: form.slug,
            description: form.description,
            price: Number(form.price || 0),
            sort_order: Number(form.sort_order || 0),
            is_active: true
          }
        : kind === "drop_points"
          ? {
              name: form.name,
              slug: form.slug,
              address: form.address || null,
              maps_url: form.maps_url || null,
              description: form.description,
              is_active: true
            }
          : {
              customer_name: form.customer_name,
              rating: Number(form.rating || 5),
              service_name: form.service_name,
              comment: form.comment,
              is_active: true
            };

    const { error } = await supabase.from(kind).insert(payload as never);
    if (error) {
      setNotice(error.message);
      return;
    }
    setForm({});
    await load();
  }

  useEffect(() => {
    load();
  }, [kind]);

  return (
    <div className="grid gap-6">
      <Card className="p-5">
        <h1 className="text-2xl font-black">Manage {titleByKind[kind]}</h1>
        {notice ? <p className="mt-2 text-sm font-bold text-neutral-600">{notice}</p> : null}
      </Card>

      <Card className="p-5">
        <form onSubmit={addItem} className="grid gap-4 md:grid-cols-2">
          {kind === "testimonials" ? (
            <>
              <Field label="Nama customer">
                <Input value={(form.customer_name as string) || ""} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
              </Field>
              <Field label="Rating">
                <Input type="number" min={1} max={5} value={(form.rating as number) || 5} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
              </Field>
              <Field label="Layanan">
                <Input value={(form.service_name as string) || ""} onChange={(e) => setForm({ ...form, service_name: e.target.value })} />
              </Field>
              <Field label="Komentar">
                <Textarea value={(form.comment as string) || ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} required />
              </Field>
            </>
          ) : (
            <>
              <Field label="Nama">
                <Input value={(form.name as string) || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Slug">
                <Input value={(form.slug as string) || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </Field>
              {kind === "services" ? (
                <>
                  <Field label="Harga">
                    <Input type="number" value={(form.price as number) || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </Field>
                  <Field label="Sort order">
                    <Input type="number" value={(form.sort_order as number) || ""} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
                  </Field>
                </>
              ) : (
                <Field label="Alamat">
                  <Input value={(form.address as string) || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </Field>
              )}
              {kind === "drop_points" ? (
                <Field label="Link Google Maps">
                  <Input value={(form.maps_url as string) || ""} onChange={(e) => setForm({ ...form, maps_url: e.target.value })} />
                </Field>
              ) : null}
              <Field label="Deskripsi">
                <Textarea value={(form.description as string) || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </Field>
            </>
          )}
          <div className="md:col-span-2">
            <Button type="submit" variant="brand">
              Tambah Data
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Detail</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-neutral-200">
                  <td className="p-4 font-black">{item.name || item.customer_name}</td>
                  <td className="p-4 text-neutral-600">
                    {kind === "services" ? formatRupiah(Number(item.price || 0)) : item.description || item.comment}
                  </td>
                  <td className="p-4">{item.is_active === false ? "Inactive" : "Active"}</td>
                  <td className="p-4">
                    <Button variant="outline" size="sm" onClick={() => toggleActive(item)} disabled={!item.id}>
                      Toggle Active
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
