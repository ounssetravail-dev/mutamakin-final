import { getResources } from "@/services/resourceService";
import {
  FileText,
  BookOpen,
  ArrowRight,
  Search,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: "technical" | "fusha";
    filter?: "article" | "book";
  }>;
}) {
  const params = await searchParams;

  const language = params.type || "technical";
  const filter = params.filter;

  const resources = await getResources({
    language,
    type: filter,
  });

  function isPdf(url: string) {
    return url?.toLowerCase().includes(".pdf");
  }

  function isImage(url: string) {
    return url?.match(/\.(jpg|jpeg|png|webp)$/i);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        <header className="py-12 border-b border-slate-100 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">
              المقالات والكتب
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              محتوى {language === "technical" ? "تقني" : "فصيح"}
            </p>
          </div>

          <div className="flex gap-2 bg-slate-50 p-1 rounded-md border border-slate-100">
            <FilterLink label="الكل" active={!filter} href={`/resources?type=${language}`} />
            <FilterLink label="مقالات" active={filter === "article"} href={`/resources?type=${language}&filter=article`} />
            <FilterLink label="كتب" active={filter === "book"} href={`/resources?type=${language}&filter=book`} />
          </div>
        </header>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {resources.map((item: any) => {
              const fileUrl = item.original_url || item.url;
              const pdf = item.type === "book" && isPdf(fileUrl);
              const image = isImage(fileUrl);

              const showThumbnail =
                item.thumbnail_url &&
                (item.type === "book" || item.type === "article");

              return (
                <div
                  key={item.id}
                  className="group border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col"
                >
                  <div className="h-48 bg-slate-100 relative">

                    {showThumbnail ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        {item.type === "book" ? (
                          <BookOpen size={32} />
                        ) : (
                          <FileText size={32} />
                        )}
                      </div>
                    )}

                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">

                    <span className="text-[10px] text-sky-600 font-bold uppercase">
                      {item.modules?.categories?.name || "عام"}
                    </span>

                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3">
                      {item.content || "لا يوجد محتوى"}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">

                      {pdf || image ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          className="text-xs bg-sky-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-sky-600 transition"
                        >
                          فتح
                          <ChevronLeft size={14} />
                        </a>
                      ) : item.type === "book" ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          className="text-xs bg-sky-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-sky-600 transition"
                        >
                          فتح
                          <ChevronLeft size={14} />
                        </a>
                      ) : (
                        <Link
                          href={`/resources/${item.id}`}
                          className="text-xs bg-sky-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-sky-600 transition"
                        >
                          قراءة
                          <ChevronLeft size={14} />
                        </Link>
                      )}

                      <ArrowRight className="text-slate-300 group-hover:text-sky-600 transition" size={14} />

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-100 rounded-lg">
            <Search size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">
              لا يوجد محتوى حالياً
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700"
          >
            <ArrowRight size={14} />
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}

function FilterLink({ label, active, href }: any) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
        active
          ? "bg-white border border-slate-200 text-sky-600"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {label}
    </Link>
  );
}