import { getMediaById } from "@/services/mediaService";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/media/VideoPlayer";
import { ArrowRight } from "lucide-react";

export default async function MediaPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getMediaById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">

      {/* NAV */}
      <div className="border-b px-6 py-4">
        <Link
          href="/media"
          className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-2"
        >
          <ArrowRight size={14} />
          العودة
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* PLAYER */}
        <VideoPlayer
          url={item.url}
          type={item.type}
          source_type={item.source_type}
          embed_url={item.embed_url}
        />

        {/* TITLE */}
        <h1 className="text-2xl font-bold">
          {item.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-500 text-sm">
          {item.description || "لا يوجد وصف"}
        </p>

        {/* CATEGORY */}
        <span className="text-xs text-sky-600 font-bold">
          {item.modules?.categories?.name || "عام"}
        </span>

        {/* ACTION */}
        <Link
          href="/exercises"
          className="inline-block mt-4 text-sm bg-sky-500 text-white px-5 py-2 rounded-md hover:bg-sky-600"
        >
          اذهب إلى التمارين
        </Link>

      </div>
    </div>
  );
}