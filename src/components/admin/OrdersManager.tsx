"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { deliveryMethodLabels, orderStatusLabels } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/lib/types";
import { prettyDate } from "@/lib/utils";
import { formatRupiah } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const statusDescriptions: Record<OrderStatus, string> = {
  new: "Order baru masuk",
  confirmed: "Sudah dikonfirmasi admin",
  picked_up: "Sepatu sudah diterima atau dijemput",
  in_treatment: "Sedang proses treatment",
  quality_check: "Sedang quality check",
  ready: "Siap diambil",
  completed: "Selesai",
  cancelled: "Dibatalkan"
};

const statusBadgeClass: Record<OrderStatus, string> = {
  new: "bg-yellow-200 text-black",
  confirmed: "bg-blue-100 text-blue-900",
  picked_up: "bg-indigo-100 text-indigo-900",
  in_treatment: "bg-black !text-white",
  quality_check: "bg-purple-100 text-purple-900",
  ready: "bg-green-100 text-green-900",
  completed: "bg-neutral-100 text-neutral-800",
  cancelled: "bg-red-100 text-red-900"
};

export function OrdersManager({ title = "Orders", limit }: { title?: string; limit?: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      setLoading(false);
      return;
    }
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (limit) {
      query = query.limit(limit);
    }
    const { data, error } = await query;
    if (error) {
      setNotice(
        `${error.message}. Kalau order sudah ada tapi tidak tampil, pastikan user admin sudah dimasukkan ke tabel admin_profiles.`
      );
    } else {
      setNotice(null);
    }
    setOrders((data || []) as Order[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setOrders((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      )
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-neutral-200 p-5">
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-neutral-500">
          Admin bisa cek order masuk dan mengubah progres treatment dari kolom status.
        </p>
        {notice ? <p className="mt-2 text-sm font-bold text-red-600">{notice}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Service</th>
              <th className="p-4">Delivery</th>
              <th className="p-4">Drop Point</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-5 text-sm font-bold text-neutral-500" colSpan={9}>
                  Memuat data order...
                </td>
              </tr>
            ) : null}
            {!loading && orders.length === 0 ? (
              <tr>
                <td className="p-5 text-sm font-bold text-neutral-500" colSpan={9}>
                  Belum ada order yang masuk. Coba submit booking dari halaman customer, lalu refresh halaman admin.
                </td>
              </tr>
            ) : null}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-neutral-200">
                <td className="p-4 font-semibold">{prettyDate(order.created_at)}</td>
                <td className="p-4 font-black">{order.customer_name}</td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">
                  {order.service_name || "-"}
                  {order.shoe_material ? (
                    <p className="mt-1 max-w-72 text-xs font-semibold text-neutral-500">{order.shoe_material}</p>
                  ) : null}
                  {(order.order_images?.length || order.image_url) ? (
                    <div className="mt-3 grid max-w-72 grid-cols-3 gap-2">
                      {(order.order_images?.length ? order.order_images : [order.image_url]).filter(Boolean).map((url, index) => (
                        <a key={`${url}-${index}`} href={url || "#"} target="_blank" rel="noreferrer">
                          <img src={url || ""} alt={`Foto order ${index + 1}`} className="h-16 w-full rounded-xl object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </td>
                <td className="p-4">{deliveryMethodLabels[order.delivery_method]}</td>
                <td className="p-4">{order.drop_point_name || "-"}</td>
                <td className="p-4 font-black">
                  {order.estimated_total ? formatRupiah(order.estimated_total) : "-"}
                  {order.surcharge_total ? (
                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                      Termasuk tambahan {formatRupiah(order.surcharge_total)}
                    </p>
                  ) : null}
                  {order.express_surcharge_total ? (
                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                      Ekspres {formatRupiah(order.express_surcharge_total)}
                    </p>
                  ) : null}
                </td>
                <td className="p-4">
                  <div className="grid min-w-48 gap-2">
                    <Badge className={statusBadgeClass[order.status]}>{orderStatusLabels[order.status]}</Badge>
                    <Select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                    >
                      {Object.entries(orderStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                    <p className="text-xs font-semibold text-neutral-500">{statusDescriptions[order.status]}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={createWhatsAppUrl(
                        order.phone,
                        `Halo ${order.customer_name}, admin DR. SHOE ingin konfirmasi order ${order.service_name || "treatment sepatu"}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
