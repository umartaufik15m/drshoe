"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { deliveryMethodLabels, orderStatusLabels } from "@/lib/constants";
import type { DeliveryMethod, OrderStatus } from "@/lib/types";
import { prettyDate } from "@/lib/utils";

type StatusOrder = {
  id: string;
  customer_name: string;
  phone: string;
  service_name: string | null;
  quantity: number;
  delivery_method: DeliveryMethod;
  drop_point_name: string | null;
  status: OrderStatus;
  estimated_total?: number | null;
  is_express?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export function StatusLookup() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<StatusOrder[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);
    setOrders([]);

    const response = await fetch("/api/booking-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const result = (await response.json()) as { orders?: StatusOrder[]; error?: string };
    setLoading(false);

    if (!response.ok) {
      setNotice(result.error || "Gagal mengecek status booking.");
      return;
    }

    setOrders(result.orders || []);
    if (!result.orders?.length) {
      setNotice("Booking belum ditemukan. Pastikan nomor WhatsApp sama seperti saat booking.");
    }
  }

  return (
    <Card className="p-5 md:p-8">
      <form onSubmit={lookup} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="Nomor WhatsApp">
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" />
        </Field>
        <Button type="submit" variant="brand" disabled={loading}>
          <Search size={16} /> {loading ? "Mengecek..." : "Cek Status"}
        </Button>
      </form>

      {notice ? (
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-sm font-bold text-neutral-700">
          {notice}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-black uppercase text-neutral-500">Booking #{order.id.slice(0, 8)}</p>
                <h3 className="mt-2 text-xl font-black">{order.service_name || "Treatment Sepatu"}</h3>
                <p className="mt-1 text-sm font-semibold text-neutral-600">
                  {order.quantity} pasang - {deliveryMethodLabels[order.delivery_method]}
                  {order.drop_point_name ? ` - ${order.drop_point_name}` : ""}
                  {order.is_express ? " - Cuci ekspres" : ""}
                </p>
                {order.estimated_total ? (
                  <p className="mt-2 text-sm font-black text-neutral-900">
                    Estimasi total: {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0
                    }).format(order.estimated_total)}
                  </p>
                ) : null}
              </div>
              <Badge className="bg-yellow-200 text-black">{orderStatusLabels[order.status]}</Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
              <p>Dibuat: {prettyDate(order.created_at)}</p>
              <p>Update: {prettyDate(order.updated_at || order.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
