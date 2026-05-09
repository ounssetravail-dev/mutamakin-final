"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminSpecializationsPage() {
  const supabase = createClient();

  const [data, setData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("specializations")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: true });

    setData((data as unknown) as any[]);
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*");

    setCategories((data as unknown) as any[]);
  }

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
  }

  async function create() {
    if (!name || !categoryId) return;

    await supabase.from("specializations").insert([
      {
        name,
        slug: generateSlug(name),
        category_id: categoryId,
      },
    ]);

    setName("");
    setCategoryId("");
    load();
  }

  async function remove(id: string) {
    await supabase
      .from("specializations")
      .delete()
      .eq("id", id);

    load();
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">

      <div className="max-w-5xl mx-auto space-y-10">

        <h1 className="text-2xl font-bold">
          إدارة التخصصات
        </h1>

        <div className="flex gap-3 flex-wrap">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم التخصص"
            className="border px-3 py-2 rounded-md text-sm"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">اختر اللغة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={create}
            className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm"
          >
            إضافة
          </button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {data.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold">
                  {item.name}
                </p>

                <p className="text-xs text-slate-400">
                  {item.categories?.name}
                </p>
              </div>

              <button
                onClick={() => remove(item.id)}
                className="text-red-500 text-xs"
              >
                حذف
              </button>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}