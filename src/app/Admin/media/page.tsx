import { getMedia, deleteMedia } from "@/services/mediaService";
import Link from "next/link";
import {
  Video,
  Trash2,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminMediaPage() {
  const items = await getMedia();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              إدارة المحتوى
            </h1>
            <p className="text-sm text-slate-500">
              الفيديوهات والمصادر التعليمية
            </p>
          </div>

          <Link
            href="/Admin/media/new"
            className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm"
          >
            إضافة محتوى
          </Link>
        </div>

        {/* LIST */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((item: any) => (
              <div
                key={item.id}
                className="border border-slate-100 rounded-lg overflow-hidden"
              >
                {/* IMAGE */}
                <div className="aspect-video bg-slate-50">
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">

                  <h3 className="text-sm font-semibold">
                    {item.title}
                  </h3>

                  <span className="text-xs text-sky-600">
                    {item.type}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center pt-3">

                    <a
                      href={item.url}
                      target="_blank"
                      className="p-2 border rounded-md"
                    >
                      <ExternalLink size={14} />
                    </a>

                    {/* 🔥 FIX */}
                    <form
                      action={async () => {
                        "use server";
                        await deleteMedia(item.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 text-red-500 border border-red-200 rounded-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>

                  </div>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            لا يوجد محتوى
          </div>
        )}

      </div>
    </div>
  );
}