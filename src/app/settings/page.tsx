"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setFullName(data.user.user_metadata?.full_name || "");
      setEmail(data.user.email || "");
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      alert("فشل التحديث");
    } else {
      alert("تم التحديث");
      router.refresh();
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">

      <h1 className="text-xl font-bold">
        إعدادات الحساب
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-3 rounded-md"
        />

        {/* EMAIL (readonly) */}
        <input
          type="email"
          value={email}
          disabled
          className="w-full border p-3 rounded-md bg-slate-50"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>

      </form>

    </div>
  );
}