"use client";

import Link from "next/link";
import {
PlayCircle,
BookOpen,
BrainCircuit,
Video,
} from "lucide-react";

export default function TechnicalLanguagePage() {

return ( <div className="min-h-screen bg-white">

  <section className="text-center py-16 border-b border-slate-100">
    <div className="flex flex-col items-center gap-6">

      <div className="w-full max-w-3xl h-56 rounded-2xl overflow-hidden shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
          alt="technical"
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          اللغة التقنية
        </h1>

        <p className="text-slate-500">
          إبدء رحلة التمكين في تخصصك
        </p>
      </div>

    </div>
  </section>

  <section className="py-12 flex flex-col items-center gap-4">
    <Link
      href={`/dashboard?type=technical&plan=free`}
      className="w-64 text-center bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 flex items-center justify-center gap-2"
    >
      تجريب مجاني
    </Link>

    <Link
      href={`/subscribe?type=technical`}
      className="w-64 text-center border border-sky-500 text-sky-600 py-3 rounded-lg font-semibold hover:bg-sky-50 flex items-center justify-center gap-2"
    >
      دفع اشتراك
    </Link>
  </section>

  <section className="py-16 border-t border-slate-100">
    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">

      <FeatureCard
        title="المكتبة السماعية"
        desc="دروس وفيديوهات"
        icon={<PlayCircle />}
        href={`/media?type=technical`}
        image="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800"
      />

      <FeatureCard
        title="المقالات والكتب"
        desc="محتوى أكاديمي"
        icon={<BookOpen />}
        href={`/resources?type=technical`}
        image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800"
      />

      <FeatureCard
        title="بنك التمارين"
        desc="قياس المستوى"
        icon={<BrainCircuit />}
        href={`/exercises?type=technical`}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"
      />

      <FeatureCard
        title="الاجتماعات"
        desc="Google Meet"
        icon={<Video />}
        href={`/meetings?type=technical`}
        image="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=800"
      />

    </div>
  </section>

</div>

);
}

function FeatureCard({
title,
desc,
icon,
href,
image,
}: {
title: string;
desc: string;
icon: React.ReactNode;
href: string;
image: string;
}) {
return ( <Link
   href={href}
   className="group border border-slate-100 rounded-lg p-6 text-center hover:bg-sky-50 transition-all duration-200 active:scale-95"
 >

  <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
    <img src={image} alt={title} className="w-full h-full object-cover" />
  </div>

  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-sky-100 text-sky-600 rounded-lg">
{icon} </div>

  <h3 className="font-semibold text-slate-900 mb-1">
    {title}
  </h3>

  <p className="text-xs text-slate-400">
    {desc}
  </p>
</Link>

);
}