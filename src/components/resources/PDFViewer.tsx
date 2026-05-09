"use client";

import { FileText, ExternalLink } from "lucide-react";

export default function PDFViewer({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <div className="w-full space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <FileText className="text-sky-500" size={18} />
          <h3 className="text-sm font-semibold">
            {title}
          </h3>
        </div>

        <a
          href={url}
          target="_blank"
          className="flex items-center gap-1 text-xs text-sky-600"
        >
          فتح
          <ExternalLink size={14} />
        </a>

      </div>

      {/* PDF VIEW */}
      <iframe
        src={url}
        className="w-full h-[600px] border rounded-lg"
      />

    </div>
  );
}