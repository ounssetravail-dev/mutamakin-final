"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMediaById,
  updateMedia,
} from "@/services/mediaService";

export default function EditMediaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    url: "",
    type: "video",
    source_type: "upload",
    thumbnail_url: "",
  });

  // تحميل البيانات
  useEffect(() => {
    async function load() {
      const data = await getMediaById(id);

      if (!data) {
        router.push("/admin/media");
        return;
      }

      setForm({
        title: data.title,
        url: data.url,
        type: data.type,
        source_type: data.source_type || "upload",
        thumbnail_url: data.thumbnail_url || "",
      });

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !form.url) {
      alert("يرجى ملء الحقول");
      return;
    }

    setSaving(true);

    try {
      await updateMedia(id, {
        title: form.title,
        url: form.url,
        type: form.type,
        thumbnail_url: form.thumbnail_url,
        source_type: form.source_type,
      });

      router.push("/admin/media");
    } catch (err) {
      alert("حدث خطأ");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">

      <h1 className="text-xl font-bold">
        تعديل المحتوى
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        />

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        >
          <option value="video">فيديو</option>
          <option value="podcast">بودكاست</option>
          <option value="article">مقال</option>
          <option value="book">PDF</option>
        </select>

        {/* SOURCE */}
        <select
          value={form.source_type}
          onChange={(e) =>
            setForm({ ...form, source_type: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        >
          <option value="upload">رفع ملف</option>
          <option value="youtube">YouTube</option>
        </select>

        {/* URL */}
        <input
          type="text"
          value={form.url}
          onChange={(e) =>
            setForm({ ...form, url: e.target.value })
          }
          className="w-full border p-3 rounded-md"
        />

        {/* THUMBNAIL */}
        <input
          type="text"
          value={form.thumbnail_url}
          onChange={(e) =>
            setForm({
              ...form,
              thumbnail_url: e.target.value,
            })
          }
          className="w-full border p-3 rounded-md"
        />

        {/* SUBMIT */}
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