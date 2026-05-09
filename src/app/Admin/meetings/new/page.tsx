"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NewMeetingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [moduleId, setModuleId] = useState("");

  const [form, setForm] = useState({
    title: "",
    meeting_url: "",
    scheduled_at: "",
  });

  useEffect(() => {
    if (!language) return;

    async function loadModule() {
      const { data } = await supabase
        .from("modules")
        .select("id, categories!inner(slug)")
        .eq("categories.slug", language)
        .limit(1);

      const modulesData = (data as unknown) as any[];

      if (modulesData && modulesData.length > 0) {
        setModuleId(modulesData[0].id);
      }
    }

    loadModule();
  }, [language]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !form.meeting_url || !form.scheduled_at || !moduleId) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("meetings").insert([
        {
          title: form.title,
          meeting_url: form.meeting_url,
          scheduled_at: form.scheduled_at,
          module_id: moduleId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      router.push("/Admin/meetings");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">

      <h1 className="text-2xl font-bold text-center">
        إضافة اجتماع جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="عنوان الاجتماع"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        />

        <input
          type="text"
          placeholder="رابط Google Meet"
          value={form.meeting_url}
          onChange={(e) =>
            setForm({ ...form, meeting_url: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        />

        <input
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) =>
            setForm({ ...form, scheduled_at: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectCard
            active={language === "technical"}
            label="اللغة التقنية"
            onClick={() => setLanguage("technical")}
          />
          <SelectCard
            active={language === "fusha"}
            label="اللغة الفصيحة"
            onClick={() => setLanguage("fusha")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ الاجتماع"}
        </button>

      </form>

    </div>
  );
}

function SelectCard({ label, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border text-center transition ${
        active
          ? "bg-sky-500 text-white border-sky-500"
          : "border-slate-200 text-slate-500 hover:bg-slate-50"
      }`}
    >
      <span className="text-xs">{label}</span>
    </button>
  );
}