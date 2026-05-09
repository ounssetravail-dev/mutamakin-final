"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Headphones, FileText } from "lucide-react";

export default function MediaCard({ item }: any) {
  const isVideo = item.type === "video";
  const isPodcast = item.type === "podcast";
  const isPDF = item.type === "book";

  return (
    <Link
      href={`/media/${item.id}`}
      className="group card card-hover overflow-hidden p-0 flex flex-col"
    >
      {/* ================= THUMBNAIL ================= */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">

        {/* IMAGE */}
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300">
            {isVideo && <Play size={32} />}
            {isPodcast && <Headphones size={32} />}
            {isPDF && <FileText size={32} />}
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">

          <div className="opacity-0 group-hover:opacity-100 transition">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <Play size={20} className="text-sky-600" />
            </div>
          </div>

        </div>

        {/* TYPE BADGE */}
        <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-md bg-white/90 text-slate-700 font-semibold shadow-sm">
          {isVideo && "فيديو"}
          {isPodcast && "بودكاست"}
          {isPDF && "PDF"}
        </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 flex flex-col gap-2">

        {/* TITLE */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition">
          {item.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-xs text-slate-500 line-clamp-2">
          {item.description || "محتوى تعليمي"}
        </p>

      </div>
    </Link>
  );
}