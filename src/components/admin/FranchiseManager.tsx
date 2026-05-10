"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { franchiseStatusLabels, partnershipTypeLabels } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { FranchiseInquiry, FranchiseStatus } from "@/lib/types";
import { prettyDate } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function FranchiseManager() {
  const [items, setItems] = useState<FranchiseInquiry[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi.");
      return;
    }
    const { data, error } = await supabase
      .from("franchise_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setNotice(error.message);
    setItems((data || []) as FranchiseInquiry[]);
  }

  async function updateStatus(id: string, status: FranchiseStatus) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase
      .from("franchise_inquiries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setNotice(error.message);
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-neutral-200 p-5">
        <h1 className="text-2xl font-black">Franchise Inquiries</h1>
        {notice ? <p className="mt-2 text-sm font-bold text-red-600">{notice}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              <th className="p-4">Partnership</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-neutral-200">
                <td className="p-4 font-semibold">{prettyDate(item.created_at)}</td>
                <td className="p-4 font-black">{item.full_name}</td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.city || "-"}</td>
                <td className="p-4">{partnershipTypeLabels[item.partnership_type]}</td>
                <td className="p-4">
                  <Select
                    value={item.status}
                    onChange={(event) => updateStatus(item.id, event.target.value as FranchiseStatus)}
                  >
                    {Object.entries(franchiseStatusLabels).map(([value, label]) => (
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
                        item.phone,
                        `Halo ${item.full_name}, admin DR. SHOE ingin follow up inquiry ${partnershipTypeLabels[item.partnership_type]}.`
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
