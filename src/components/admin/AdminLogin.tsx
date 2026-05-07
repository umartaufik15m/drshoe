"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setNotice("Supabase belum dikonfigurasi. Isi .env.local untuk login admin.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setNotice(error.message);
      return;
    }
    router.push("/admin");
  }

  return (
    <section className="section bg-neutral-100">
      <div className="container max-w-xl">
        <Card className="p-6 md:p-8">
          <h1 className="text-3xl font-black">Login Admin</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Masuk dengan akun Supabase Auth yang sudah terdaftar di admin_profiles.
          </p>
          <form onSubmit={handleLogin} className="mt-8 grid gap-5">
            <Field label="Email">
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            {notice || !isSupabaseConfigured ? (
              <div className="rounded-2xl bg-neutral-100 p-4 text-sm font-bold text-neutral-700">
                {notice || "Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk mengaktifkan login."}
              </div>
            ) : null}
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? "Masuk..." : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
