"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SpecializationsPage() {
  const supabase = createClient();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"technical" | "fusha">("technical");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("specializations")
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq("categories.slug", language)
        .order("created_at", { ascending: true });

      setData((data as unknown) as any[]);
      setLoading(false);
    };

    load();
  }, [language]);

  return (
    <div className="min-h-screen bg-white px-6 py-16">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-center text-slate-900 mb-10">
          التخصصات
        </h1>

        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setLanguage("technical")}
            className={`px-4 py-2 text-sm rounded-md border ${
              language === "technical"
                ? "bg-sky-500 text-white border-sky-500"
                : "text-slate-400 border-slate-200"
            }`}
          >
            تقنية
          </button>

          <button
            onClick={() => setLanguage("fusha")}
            className={`px-4 py-2 text-sm rounded-md border ${
              language === "fusha"
                ? "bg-sky-500 text-white border-sky-500"
                : "text-slate-400 border-slate-200"
            }`}
          >
            فصحى
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-slate-400">
            لا يوجد تخصصات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

            {data.map((item) => (
              <Link
                key={item.id}
                href={`/media?type=${item.categories?.slug}&specialization=${item.id}`}
                className="group border border-slate-200 rounded-xl p-6 text-center hover:bg-sky-50 transition-all"
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-400">
                  {item.categories?.name}
                </p>
              </Link>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}