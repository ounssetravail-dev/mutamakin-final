"use client";

import { useEffect, useState } from "react";
import { getResources, deleteResource } from "@/services/resourceService";
import Link from "next/link";
import {
  FileText,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getResources();
    setResources(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const ok = confirm("هل تريد الحذف؟");
    if (!ok) return;

    await deleteResource(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  function isPdf(url: string) {
    return url?.toLowerCase().includes(".pdf");
  }

  function isImage(url: string) {
    return url?.match(/\.(jpg|jpeg|png|webp)$/i);
  }

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">إدارة المصادر</h1>

        <Link
          href="/Admin/resources/new"
          className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm"
        >
          إضافة
        </Link>
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {resources.map((item) => {
            const fileUrl = item.original_url || item.url;
            const pdf = item.type === "book" && isPdf(fileUrl);
            const image = isImage(fileUrl);

            return (
              <div
                key={item.id}
                className="group border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="h-44 bg-slate-100 relative">

                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FileText size={32} />
                    </div>
                  )}

                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">

                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {item.type === "article" ? "مقال" : "ملف"}
                  </p>

                  <p className="text-xs text-sky-600 font-semibold">
                    {item.modules?.categories?.slug === "technical"
                      ? "اللغة التقنية"
                      : item.modules?.categories?.slug === "fusha"
                      ? "اللغة الفصيحة"
                      : "غير محدد"}
                  </p>

                  <div className="flex justify-between mt-auto pt-3">

                    <div className="flex gap-2">

                      {/* ✅ فتح مباشر صحيح */}
                      {pdf ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          className="p-2 border rounded-md hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : image ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          className="p-2 border rounded-md hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : item.type === "book" ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          className="p-2 border rounded-md hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <Link
                          href={`/resources/${item.id}`}
                          className="p-2 border rounded-md hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}

                      <Link
                        href={`/Admin/resources/edit/${item.id}`}
                        className="p-2 border rounded-md hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                      </Link>

                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          لا يوجد محتوى
        </div>
      )}

    </div>
  );
}