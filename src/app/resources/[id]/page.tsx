import { getResourceById } from "@/services/resourceService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, ExternalLink } from "lucide-react";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const item = await getResourceById(id);

  if (!item) notFound();

  const fileUrl = item.file_url || item.original_url || item.url;

  const isPdf = item.is_pdf;
  const isImage = item.is_image;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">

      {/* HEADER */}
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <Link
            href="/resources"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700"
          >
            <ArrowRight size={14} />
            العودة
          </Link>

          <span className="text-xs text-slate-400">
            {item.modules?.categories?.name || ""}
          </span>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <h1 className="text-2xl font-bold">
          {item.title}
        </h1>

        {item.thumbnail_url && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={item.thumbnail_url}
              className="w-full h-72 object-cover"
            />
          </div>
        )}

        {/* 🔥 PDF الحل النهائي */}
        {isPdf && (
          <div className="border rounded-xl p-6 text-center space-y-4">

            <FileText className="mx-auto text-sky-500" size={40} />

            <p className="text-sm text-slate-600">
              اضغط لعرض الملف مباشرة
            </p>

            <a
              href={fileUrl}
              target="_blank"
              className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition"
            >
              فتح الملف
              <ExternalLink size={14} />
            </a>

          </div>
        )}

        {/* IMAGE */}
        {isImage && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={fileUrl}
              className="w-full max-h-[650px] object-contain mx-auto"
            />
          </div>
        )}

        {/* GENERIC FILE */}
        {!isPdf && !isImage && item.type === "book" && (
          <div className="border rounded-xl p-6 text-center space-y-4">

            <FileText className="mx-auto text-sky-500" size={40} />

            <p className="text-sm text-slate-600">
              هذا الملف لا يمكن عرضه داخل الصفحة
            </p>

            <a
              href={fileUrl}
              target="_blank"
              className="inline-block text-white bg-sky-500 px-4 py-2 rounded-md text-sm hover:bg-sky-600 transition"
            >
              فتح الملف
            </a>

          </div>
        )}

        {/* ARTICLE */}
        {item.type === "article" && (
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            {item.content || "لا يوجد محتوى"}
          </div>
        )}

      </div>
    </div>
  );
}