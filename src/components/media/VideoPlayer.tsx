"use client";

import { Loader2, Play } from "lucide-react";
import { useState } from "react";

interface Props {
  url: string;
  type: "video" | "podcast" | "book";
  source_type?: "upload" | "youtube";
  embed_url?: string;
  thumbnail?: string;
}

export default function VideoPlayer({
  url,
  type,
  source_type,
  embed_url,
  thumbnail,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const Container = ({ children }: any) => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black">
        {children}
      </div>
    </div>
  );

  const Overlay = () => (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition group-hover:bg-black/50">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl transition group-hover:scale-110">
        <Play className="text-sky-600" size={28} />
      </div>
    </div>
  );

  /* ================= YOUTUBE ================= */
  if (source_type === "youtube" && embed_url) {
    return (
      <Container>
        {!isPlaying && (
          <div
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer group"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Play size={40} className="text-white/60" />
              </div>
            )}

            <Overlay />
          </div>
        )}

        {isPlaying && (
          <iframe
            src={embed_url}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </Container>
    );
  }

  /* ================= VIDEO ================= */
  if (type === "video") {
    return (
      <Container>
        {!isPlaying && (
          <div
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer group"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Play size={40} className="text-white/60" />
              </div>
            )}

            <Overlay />
          </div>
        )}

        {isPlaying && (
          <video
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
            src={url}
          />
        )}
      </Container>
    );
  }

  /* ================= PODCAST ================= */
  if (type === "podcast") {
    return (
      <div className="max-w-3xl mx-auto border border-slate-200 rounded-xl p-4 bg-white">
        <audio controls className="w-full" src={url} />
      </div>
    );
  }

  /* ================= PDF ================= */
  if (type === "book") {
    return (
      <div className="max-w-5xl mx-auto">
        <iframe
          src={url}
          className="w-full h-[700px] border border-slate-200 rounded-xl"
        />
      </div>
    );
  }

  /* ================= FALLBACK ================= */
  return (
    <div className="w-full aspect-video flex items-center justify-center border border-slate-200 rounded-xl">
      <Loader2 className="animate-spin text-slate-400" />
    </div>
  );
}