import { createClient } from "@/utils/supabase/server";
import {
  Users,
  Video,
  BookOpen,
  Brain,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    users,
    media,
    exercises,
    meetings,
    specializations,
    technicalSpecs,
    fushaSpecs
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("media_resources").select("*", { count: "exact", head: true }),
    supabase.from("exercises").select("*", { count: "exact", head: true }),
    supabase.from("meetings").select("*", { count: "exact", head: true }),
    supabase.from("specializations").select("*", { count: "exact", head: true }),

    supabase
      .from("specializations")
      .select("id", { count: "exact", head: true })
      .eq("categories.slug", "technical"),

    supabase
      .from("specializations")
      .select("id", { count: "exact", head: true })
      .eq("categories.slug", "fusha"),
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        <div>
          <h1 className="text-2xl font-bold">
            لوحة التحكم
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            إدارة المحتوى والمنصة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

          <Stat title="المستخدمين" value={users.count || 0} icon={<Users size={18} />} />
          <Stat title="المحتوى" value={media.count || 0} icon={<Video size={18} />} />
          <Stat title="التمارين" value={exercises.count || 0} icon={<Brain size={18} />} />
          <Stat title="الاجتماعات" value={meetings.count || 0} icon={<BookOpen size={18} />} />
          <Stat title="التخصصات" value={specializations.count || 0} icon={<BookOpen size={18} />} />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-5">

          <Stat title="تخصصات تقنية" value={technicalSpecs.count || 0} icon={<BookOpen size={18} />} />
          <Stat title="تخصصات فصيحة" value={fushaSpecs.count || 0} icon={<BookOpen size={18} />} />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <AdminCard
            title="إدارة الوسائط"
            desc="إضافة وتعديل الفيديوهات والبودكاست"
            href="/Admin/media"
          />

          <AdminCard
            title="إدارة المقالات"
            desc="إضافة الكتب والمقالات"
            href="/Admin/resources"
          />

          <AdminCard
            title="إدارة التمارين"
            desc="إنشاء التمارين والأسئلة"
            href="/Admin/exercises"
          />

          <AdminCard
            title="إدارة الاجتماعات"
            desc="إضافة روابط Google Meet"
            href="/Admin/meetings"
          />

          <AdminCard
            title="إدارة التخصصات"
            desc="إضافة وتعديل تخصصات اللغات"
            href="/Admin/specializations"
          />

        </div>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition"
          >
            <ArrowRight size={14} />
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card text-center">

      <div className="flex justify-center mb-3 text-sky-500">
        {icon}
      </div>

      <p className="text-xs text-slate-400 mb-1">
        {title}
      </p>

      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function AdminCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card card-hover"
    >
      <h3 className="font-semibold text-slate-900 mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-500 leading-relaxed">
        {desc}
      </p>
    </Link>
  );
}