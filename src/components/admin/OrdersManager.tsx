"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { deliveryMethodLabels, orderStatusLabels, WHATSAPP_NUMBER } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/lib/types";
import { prettyDate } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      return;
    }
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) setNotice(error.message);
    setOrders((data || []) as Order[]);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setOrders((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-neutral-200 p-5">
        <h1 className="text-2xl font-black">Orders</h1>
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
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-neutral-200">
                <td className="p-4 font-semibold">{prettyDate(order.created_at)}</td>
                <td className="p-4 font-black">{order.customer_name}</td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">{order.service_name || "-"}</td>
                <td className="p-4">{deliveryMethodLabels[order.delivery_method]}</td>
                <td className="p-4">{order.drop_point_name || "-"}</td>
                <td className="p-4">
                  <Select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}>
                    {Object.entries(orderStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="p-4">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={createWhatsAppUrl(
                        WHATSAPP_NUMBER,
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
