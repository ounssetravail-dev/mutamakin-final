"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createResource } from "@/services/resourceService";
import { createClient } from "@/utils/supabase/client";
import {
  FileText,
  UploadCloud,
  Link,
  Image,
} from "lucide-react";

export default function NewResourcePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [language, setLanguage] = useState("");
  const [moduleId, setModuleId] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "article",
    source_type: "upload",
    url: "",
    content: "",
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

  async function uploadFile(file: File) {
    try {
      const reader = new FileReader();

      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: base64 }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error();
      }

      const data = await res.json();

      if (!data.url) throw new Error();

      return data.url;
    } catch {
      alert("فشل رفع الملف");
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !moduleId) {
      alert("يرجى إدخال العنوان واختيار القسم");
      return;
    }

    setLoading(true);

    try {
      let finalUrl = form.url;
      let thumbnailUrl = null;

      if (form.source_type === "upload") {
        if (!file) {
          alert("يرجى اختيار ملف");
          setLoading(false);
          return;
        }

        const uploaded = await uploadFile(file);
        if (!uploaded) return;

        finalUrl = uploaded;
      }

      if (thumbnail) {
        const uploadedThumb = await uploadFile(thumbnail);
        if (!uploadedThumb) return;

        thumbnailUrl = uploadedThumb;
      }

      await createResource({
        title: form.title,
        type: form.type as any,
        url: finalUrl,
        content: form.content,
        module_id: moduleId,
        thumbnail_url: thumbnailUrl,
      });

      router.push("/Admin/resources");
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">

      <h1 className="text-2xl font-bold text-center">
        إضافة مصدر جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="عنوان المصدر"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
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

        <div className="grid grid-cols-2 gap-4">
          <SelectCard
            active={form.type === "article"}
            icon={<FileText />}
            label="مقال"
            onClick={() =>
              setForm({ ...form, type: "article" })
            }
          />
          <SelectCard
            active={form.type === "book"}
            icon={<FileText />}
            label="ملف / كتاب"
            onClick={() =>
              setForm({ ...form, type: "book" })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectCard
            active={form.source_type === "upload"}
            icon={<UploadCloud />}
            label="رفع ملف"
            onClick={() =>
              setForm({ ...form, source_type: "upload" })
            }
          />
          <SelectCard
            active={form.source_type === "link"}
            icon={<Link />}
            label="رابط"
            onClick={() =>
              setForm({ ...form, source_type: "link" })
            }
          />
        </div>

        {form.source_type === "upload" && (
          <UploadBox
            label="رفع الملف"
            accept=".pdf,.doc,.docx,.png,.jpg"
            file={file}
            setFile={setFile}
          />
        )}

        {form.source_type === "link" && (
          <input
            type="text"
            placeholder="رابط المصدر"
            value={form.url}
            onChange={(e) =>
              setForm({ ...form, url: e.target.value })
            }
            className="w-full border p-3 rounded-md"
          />
        )}

        {form.type === "article" && (
          <textarea
            placeholder="محتوى المقال"
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            className="w-full border p-3 rounded-md min-h-40"
          />
        )}

        <UploadBox
          label="صورة الغلاف"
          accept="image/*"
          file={thumbnail}
          setFile={setThumbnail}
          icon={<Image />}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ المصدر"}
        </button>

      </form>

    </div>
  );
}

function UploadBox({ label, file, setFile, accept, icon }: any) {
  return (
    <label className="block border-2 border-dashed border-sky-300 rounded-xl p-8 text-center cursor-pointer hover:bg-sky-50 transition">
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-500">
          {icon || <UploadCloud />}
        </div>

        <p className="text-sm font-medium">{label}</p>

        {file && (
          <p className="text-xs text-emerald-600">
            {file.name}
          </p>
        )}
      </div>
    </label>
  );
}

function SelectCard({ icon, label, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition ${
        active
          ? "bg-sky-500 text-white border-sky-500"
          : "border-slate-200 text-slate-500 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}