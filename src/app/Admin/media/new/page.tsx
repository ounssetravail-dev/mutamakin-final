"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMedia } from "@/services/mediaService";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Youtube, Video, Image } from "lucide-react";

export default function NewMediaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [language, setLanguage] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [specializationId, setSpecializationId] = useState("");

  const [form, setForm] = useState({
    title: "",
    source_type: "upload",
    url: "",
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

    async function loadSpecializations() {
      const { data } = await supabase
        .from("specializations")
        .select(`
          *,
          categories!inner(slug)
        `)
        .eq("categories.slug", language)
        .order("created_at", { ascending: true });

      setSpecializations((data as unknown) as any[]);
      setSpecializationId("");
    }

    loadModule();
    loadSpecializations();
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

    if (!form.title || !moduleId) {
      alert("يرجى إدخال العنوان واختيار القسم");
      return;
    }

    if (specializations.length > 0 && !specializationId) {
      alert("يرجى اختيار التخصص");
      return;
    }

    setLoading(true);

    try {
      let finalUrl = form.url;
      let thumbnailUrl = null;

      if (form.source_type === "upload") {
        if (!file) {
          alert("يرجى اختيار فيديو");
          setLoading(false);
          return;
        }

        finalUrl = await uploadFile(file);
      }

      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail);
      }

      await createMedia({
        title: form.title,
        url: finalUrl,
        type: "video",
        module_id: moduleId,
        source_type: form.source_type as any,
        thumbnail_url: thumbnailUrl,
        specialization_id: specializationId || undefined,
      });

      router.push("/Admin/media");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الرفع");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">

      <h1 className="text-2xl font-bold text-center">
        إضافة فيديو جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="عنوان الفيديو"
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

        {specializations.length > 0 && (
          <select
            value={specializationId}
            onChange={(e) => setSpecializationId(e.target.value)}
            className="w-full border p-3 rounded-md"
          >
            <option value="">اختر التخصص</option>
            {specializations.map((spec: any) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        )}

        <div className="grid grid-cols-2 gap-4">
          <SelectCard
            active={form.source_type === "upload"}
            icon={<UploadCloud />}
            label="رفع فيديو"
            onClick={() =>
              setForm({ ...form, source_type: "upload" })
            }
          />
          <SelectCard
            active={form.source_type === "youtube"}
            icon={<Youtube />}
            label="YouTube"
            onClick={() =>
              setForm({ ...form, source_type: "youtube" })
            }
          />
        </div>

        {form.source_type === "upload" && (
          <UploadBox
            label="رفع الفيديو"
            icon={<Video />}
            accept="video/*"
            file={file}
            setFile={setFile}
          />
        )}

        {form.source_type === "youtube" && (
          <input
            type="text"
            placeholder="رابط YouTube"
            value={form.url}
            onChange={(e) =>
              setForm({ ...form, url: e.target.value })
            }
            className="w-full border p-3 rounded-md"
          />
        )}

        <UploadBox
          label="صورة الغلاف"
          icon={<Image />}
          accept="image/*"
          file={thumbnail}
          setFile={setThumbnail}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {loading ? "جارٍ الرفع..." : "حفظ الفيديو"}
        </button>

      </form>

    </div>
  );
}

function UploadBox({ label, icon, accept, file, setFile }: any) {
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
          {icon}
        </div>

        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>

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
      className={`p-4 rounded-lg border text-center flex flex-col items-center gap-2 transition ${
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