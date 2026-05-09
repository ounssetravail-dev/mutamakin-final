import { createClient } from "@/utils/supabase/server";
import { getUserResults } from "@/services/exerciseService";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">يرجى تسجيل الدخول</p>
        <Link href="/login" className="text-sky-600">
          دخول
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp")
    .eq("id", user.id)
    .single();

  const results = await getUserResults();

  const completed = results.filter((r: any) => r.passed).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            الملف الشخصي
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            معلومات حسابك
          </p>
        </div>

        {/* USER INFO */}
        <div className="border border-slate-100 rounded-lg p-6 space-y-4">

          <div>
            <p className="text-xs text-slate-400">الاسم</p>
            <p className="font-semibold">
              {profile?.full_name || "مستخدم"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">البريد الإلكتروني</p>
            <p className="font-semibold">
              {user.email}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">

          <Stat title="XP" value={profile?.xp || 0} />

          <Stat title="تمارين مكتملة" value={completed} />

        </div>

        {/* BACK */}
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-2"
        >
          <ArrowRight size={14} />
          العودة
        </Link>

      </div>
    </div>
  );
}

/* STAT */
function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="border border-slate-100 rounded-lg p-4 text-center">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}