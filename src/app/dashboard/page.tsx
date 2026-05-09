import { createClient } from "@/utils/supabase/server";
import { getUserResults } from "@/services/exerciseService";
import Link from "next/link";
import {
  Brain,
  BookOpen,
  Video,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name, xp, role")
    .eq("id", user.id)
    .single();

  const profile = data as {
    full_name: string | null;
    xp: number;
    role: "student" | "admin";
  } | null;

  const results = await getUserResults();

  const completed = results.filter((r: any) => r.passed).length;
  const totalXP = profile?.xp || 0;

  const progress =
    results.length > 0
      ? Math.round((completed / results.length) * 100)
      : 0;

  const lastResult = results[0];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">
            مرحباً {profile?.full_name || "بك"}
          </h1>

          <p className="text-sm text-slate-500">
            استمر في التعلم وطور مهاراتك
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <StatCard
            title="التمارين المكتملة"
            value={completed}
            icon={<Trophy />}
          />

          <StatCard
            title="XP"
            value={totalXP}
            icon={<Brain />}
          />

          <StatCard
            title="نسبة التقدم"
            value={progress + "%"}
            icon={<Video />}
          />

        </div>

        {/* 🔥 PROGRESS BAR */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            تقدمك العام
          </p>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 🔥 LAST ACTIVITY */}
        {lastResult && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-2">
            <p className="text-xs text-slate-400">
              آخر نشاط
            </p>

            <p className="text-sm font-medium">
              نتيجة التمرين: {lastResult.score}%
            </p>
          </div>
        )}

        {/* QUICK ACCESS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <QuickCard
            title="المكتبة"
            icon={<Video />}
            href="/media"
          />

          <QuickCard
            title="المقالات"
            icon={<BookOpen />}
            href="/resources"
          />

          <QuickCard
            title="التمارين"
            icon={<Brain />}
            href="/exercises"
          />

          <QuickCard
            title="الاجتماعات"
            icon={<Video />}
            href="/meetings"
          />

        </div>

        {/* BACK */}
        <Link
          href="/"
          className="text-xs text-slate-400 flex items-center gap-2 hover:text-slate-700 transition"
        >
          <ArrowRight size={14} />
          العودة
        </Link>

      </div>
    </div>
  );
}

/* STAT */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-slate-100 rounded-xl p-4 text-center transition hover:shadow-md hover:-translate-y-1">

      <div className="flex justify-center text-sky-500 mb-1">
        {icon}
      </div>

      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="text-lg font-bold">
        {value}
      </p>

    </div>
  );
}

/* QUICK */
function QuickCard({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-2 transition hover:bg-slate-50 hover:shadow-md hover:-translate-y-1"
    >
      <div className="text-sky-500">
        {icon}
      </div>

      <p className="text-xs font-semibold text-center">
        {title}
      </p>
    </Link>
  );
}