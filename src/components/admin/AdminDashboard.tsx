"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { FranchiseInquiry, Order } from "@/lib/types";

type Stats = {
  totalOrders: number;
  newOrders: number;
  inTreatment: number;
  completed: number;
  franchise: number;
  newFranchise: number;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    inTreatment: 0,
    completed: 0,
    franchise: 0,
    newFranchise: 0
  });

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;
      const [ordersResult, franchiseResult] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("franchise_inquiries").select("*")
      ]);
      const orders = (ordersResult.data || []) as Order[];
      const franchise = (franchiseResult.data || []) as FranchiseInquiry[];
      setStats({
        totalOrders: orders.length,
        newOrders: orders.filter((item) => item.status === "new").length,
        inTreatment: orders.filter((item) => item.status === "in_treatment").length,
        completed: orders.filter((item) => item.status === "completed").length,
        franchise: franchise.length,
        newFranchise: franchise.filter((item) => item.status === "new").length
      });
    }
    load();
  }, []);

  const cards = [
    ["Total orders", stats.totalOrders],
    ["New orders", stats.newOrders],
    ["Orders in treatment", stats.inTreatment],
    ["Completed orders", stats.completed],
    ["Franchise inquiries", stats.franchise],
    ["New franchise leads", stats.newFranchise]
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, value]) => (
        <Card key={label} className="p-6">
          <p className="text-sm font-black uppercase text-neutral-500">{label}</p>
          <p className="mt-4 text-5xl font-black">{value}</p>
        </Card>
      ))}
    </div>
  );
}
