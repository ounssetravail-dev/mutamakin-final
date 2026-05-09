"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "technical";

  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubscribe() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // 🔥 جلب module حسب القسم
    const { data: module } = await supabase
      .from("modules")
      .select(`
        id,
        categories!inner(slug)
      `)
      .eq("categories.slug", type)
      .eq("is_free", false)
      .limit(1)
      .single();

    if (!module) {
      alert("لا يوجد محتوى مدفوع لهذا القسم");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("subscriptions")
      .insert([
        {
          user_id: user.id,
          module_id: module.id,
          status: "active",
        },
      ]);

    if (error) {
      alert("حدث خطأ");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex items-center justify-center px-6">

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-6 shadow-lg animate-fade-in">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-extrabold">
            الاشتراك
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {type === "technical"
              ? "الوصول إلى جميع محتوى اللغة التقنية"
              : "الوصول إلى جميع محتوى اللغة الفصيحة"}
          </p>
        </div>

        {/* PLAN */}
        <div className="border border-sky-200 bg-sky-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-sky-700">
            اشتراك كامل
          </p>
          <p className="text-xs text-slate-500 mt-1">
            وصول غير محدود لكل المحتوى
          </p>
        </div>

        {/* FEATURES */}
        <div className="space-y-3 text-sm text-slate-600">

          <Feature text="الوصول الكامل لجميع الدروس" />
          <Feature text="تمارين غير محدودة" />
          <Feature text="محتوى حصري" />
          <Feature text="جلسات مباشرة" />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition shadow-md hover:scale-[1.02]"
        >
          {loading ? "جارٍ المعالجة..." : "تفعيل الاشتراك"}
        </button>

        {/* BACK */}
        <button
          onClick={() => router.push("/")}
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto transition"
        >
          <ArrowRight size={14} />
          العودة
        </button>

      </div>
    </div>
  );
}

/* FEATURE */
function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <CheckCircle size={16} className="text-emerald-500" />
      <span>{text}</span>
    </div>
  );
}