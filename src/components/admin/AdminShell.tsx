"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/franchise", label: "Franchise" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setCheckingAuth(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setAdminEmail(data.session.user.email || null);
      setCheckingAuth(false);
    }

    checkSession();
  }, [router]);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase?.auth.signOut();
    router.push("/admin/login");
  }

  if (checkingAuth) {
    return (
      <section className="section bg-neutral-100">
        <div className="container">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm font-bold text-neutral-600">
            Mengecek sesi admin...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-neutral-100">
      <div className="container">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-black">Admin DR. SHOE</p>
            <p className="text-sm font-semibold text-neutral-500">
              {adminEmail
                ? `Login sebagai ${adminEmail}`
                : isSupabaseConfigured
                  ? "Terhubung ke Supabase"
                  : "Mode demo: isi env Supabase untuk data live"}
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-neutral-200 bg-white p-3">
            <nav className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-100 hover:text-black",
                    pathname === link.href && "bg-black !text-white hover:bg-black hover:!text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
