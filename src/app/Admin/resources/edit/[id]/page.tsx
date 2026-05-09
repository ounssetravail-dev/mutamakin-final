"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getResourceById,
  updateResource,
} from "@/services/resourceService";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Image, FileText } from "lucide-react";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [language, setLanguage] = useState("");
  const [moduleId, setModuleId] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "article",
    url: "",
    content: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    if (!id) return;

    async function load() {
      const data = await getResourceById(id);

      if (!data) {
        router.push("/Admin/resources");
        return;
      }

      const item = data as any;

      setForm({
        title: item.title || "",
        type: item.type || "article",
        url: item.original_url || item.url || "",
        content: item.content || "",
        thumbnail_url: item.thumbnail_url || "",
      });

      setLanguage(item.modules?.categories?.slug || "");
      setModuleId(item.module_id || "");

      setLoading(false);
    }

    load();
  }, [id]);

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
    const reader = new FileReader();

    const base64 = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({ file: base64 }),
    });

    const data = await res.json();

    if (!data.url) throw new Error();

    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title) {
      alert("يرجى إدخال العنوان");
      return;
    }

    setSaving(true);

    try {
      let finalUrl = form.url;
      let originalUrl = form.url;
      let thumbnailUrl = form.thumbnail_url;

      if (file) {
        const uploaded = await uploadFile(file);
        finalUrl = uploaded;
        originalUrl = uploaded;
      }

      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail);
      }

      await updateResource(id, {
        title: form.title,
        url: finalUrl,
        original_url: originalUrl,
        content: form.content,
        module_id: moduleId,
        thumbnail_url: thumbnailUrl,
      });

      router.push("/Admin/resources");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التحديث");
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">

      <h1 className="text-xl font-bold">
        تعديل المصدر
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
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

        {form.type === "article" && (
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            className="w-full border p-3 rounded-md min-h-[150px]"
          />
        )}

        {form.thumbnail_url && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={form.thumbnail_url}
              className="w-full h-56 object-cover"
            />
          </div>
        )}

        <UploadBox
          label="تغيير الملف (اختياري)"
          file={file}
          setFile={setFile}
          icon={<FileText />}
        />

        <UploadBox
          label="تغيير صورة الغلاف"
          file={thumbnail}
          setFile={setThumbnail}
          icon={<Image />}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {saving ? "جارٍ الحفظ..." : "تحديث"}
        </button>

      </form>

    </div>
  );
}

function UploadBox({ label, file, setFile, icon }: any) {
  return (
    <label className="block border-2 border-dashed border-sky-300 rounded-xl p-6 text-center cursor-pointer hover:bg-sky-50 transition">
      <input
        type="file"
        className="hidden"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <div className="flex flex-col items-center gap-2">
        <div className="text-sky-500">
          {icon || <UploadCloud />}
        </div>

        <p className="text-sm">{label}</p>

        {file && (
          <p className="text-xs text-emerald-600">
            {file.name}
          </p>
        )}
      </div>
    </label>
  );
}

function SelectCard({ label, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-lg border text-sm ${
        active
          ? "bg-sky-500 text-white border-sky-500"
          : "border-slate-200 text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}