import { Zap, Globe, BookOpen, Video, FileText, Users, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  let profilesMap: Record<string, any> = {};

  const safeReviews = (reviews || []) as any[];

  if (safeReviews.length > 0) {
    const userIds = safeReviews.map((r) => r.user_id).filter(Boolean);

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      profilesMap =
        profiles?.reduce((acc: any, p: any) => {
          acc[p.id] = p;
          return acc;
        }, {}) || {};
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      <section className="pt-28 pb-20 px-6 text-center bg-linear-to-b from-white to-sky-50">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">

          <div className="relative w-24 h-24">
            <Image
              src="/logo-mutamakin.png"
              alt="Mutamakin"
              fill
              sizes="96px"
              className="object-contain drop-shadow-sm"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            منصة <span className="text-sky-600">متمكن</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            منصة تعليمية تفاعلية لتطوير مهاراتك اللغوية بأسلوب حديث،
            بسيط، واحترافي يركز على التطبيق العملي.
          </p>

          <div className="w-full max-w-3xl h-64 relative rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200"
              alt="learning"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              href="/language/technical"
              className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition shadow-md"
            >
              ابدأ التعلم
            </Link>

            <Link
              href="/language/fusha"
              className="px-7 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-white transition"
            >
              استكشف المسارات
            </Link>
          </div>

        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        <Card
          href="/language/technical"
          title="اللغة التقنية"
          desc="تعلم المصطلحات التقنية وطور مهاراتك المهنية بشكل عملي"
          icon={<Zap size={30} />}
          image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
        />

        <Card
          href="/language/fusha"
          title="اللغة الفصيحة"
          desc="طور لغتك العربية بأسلوب حديث وتفاعلي يعزز مهاراتك"
          icon={<Globe size={30} />}
          image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200"
        />

      </section>

      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">

          <Feature icon={<Video size={20} />} title="فيديوهات" desc="شرح مرئي واضح" />
          <Feature icon={<FileText size={20} />} title="مقالات" desc="محتوى غني" />
          <Feature icon={<BookOpen size={20} />} title="تمارين" desc="تطبيق عملي" />
          <Feature icon={<Users size={20} />} title="اجتماعات" desc="جلسات مباشرة" />

        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              آراء المستخدمين
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              تجارب حقيقية من مستخدمي المنصة
            </p>
          </div>

          {safeReviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {safeReviews.map((review: any) => {
                const profile = profilesMap[review.user_id];

                return (
                  <div
                    key={review.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-sm font-bold">
                          {profile?.full_name?.charAt(0) || "?"}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {profile?.full_name || "مستخدم"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-sm text-slate-400">
              لا توجد آراء حالياً
            </div>
          )}

          <div className="mt-12 max-w-xl mx-auto">
            <form
              action="/api/review"
              method="post"
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4"
            >
              <textarea
                name="content"
                required
                placeholder="اكتب رأيك..."
                className="input"
              />

              <select name="rating" required className="input">
                <option value="">التقييم</option>
                <option value="5">5 ممتاز</option>
                <option value="4">4 جيد جدا</option>
                <option value="3">3 جيد</option>
                <option value="2">2 ضعيف</option>
                <option value="1">1 سيء</option>
              </select>

              <button className="btn btn-primary">
                إرسال الرأي
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}

function Card({ title, desc, icon, href, image }: any) {
  return (
    <Link
      href={href}
      className="group bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-start text-right shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-full h-40 relative rounded-xl overflow-hidden mb-6">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="mb-6 p-4 bg-sky-100 text-sky-600 rounded-xl group-hover:scale-110 transition">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {title}
      </h2>

      <p className="text-slate-500 text-sm leading-relaxed">
        {desc}
      </p>
    </Link>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition">
      
      <div className="mb-3 inline-flex p-2 rounded-lg bg-white text-sky-600 shadow-sm">
        {icon}
      </div>

      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        {title}
      </h4>

      <p className="text-xs text-slate-500">
        {desc}
      </p>
    </div>
  );
}