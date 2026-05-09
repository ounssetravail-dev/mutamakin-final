import {
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function GoogleMeetCard({ meeting }: any) {
  const date = new Date(meeting.scheduled_at);

  return (
    <div className="border border-slate-100 rounded-lg p-5 space-y-3">

      {/* TITLE */}
      <h3 className="font-semibold text-slate-900">
        {meeting.title}
      </h3>

      {/* DATE */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {date.toLocaleDateString()}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={14} />
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* STATUS */}
      <span
        className={`text-xs font-semibold ${
          meeting.status === "live"
            ? "text-red-500"
            : meeting.status === "upcoming"
            ? "text-sky-600"
            : "text-slate-400"
        }`}
      >
        {meeting.status === "live"
          ? "مباشر الآن"
          : meeting.status === "upcoming"
          ? "قريباً"
          : "منتهية"}
      </span>

      {/* ACTION */}
      {meeting.status === "live" ? (
        <a
          href={meeting.meeting_url}
          target="_blank"
          className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-md text-sm hover:bg-sky-600"
        >
          دخول الجلسة
          <ExternalLink size={14} />
        </a>
      ) : (
        <button
          disabled
          className="bg-slate-100 text-slate-400 px-4 py-2 rounded-md text-sm"
        >
          غير متاح
        </button>
      )}

    </div>
  );
}