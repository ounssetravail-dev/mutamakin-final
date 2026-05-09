import { getMeetings, deleteMeeting } from "@/services/meetingService";
import {
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminMeetingsPage() {
  const meetings = await getMeetings();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              إدارة الاجتماعات
            </h1>
            <p className="text-sm text-slate-500">
              إضافة وتنظيم جلسات Google Meet
            </p>
          </div>

          <Link
            href="/Admin/meetings/new"
            className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm"
          >
            إضافة اجتماع
          </Link>
        </div>

        {/* LIST */}
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {meetings.map((m: any) => {
              const date = new Date(m.scheduled_at);

              return (
                <div
                  key={m.id}
                  className="group border border-slate-100 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between"
                >
                  {/* INFO */}
                  <div className="space-y-3">

                    <h3 className="font-semibold text-slate-900">
                      {m.title}
                    </h3>

                    <div className="text-xs text-slate-500 flex gap-4">
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

                    {/* CATEGORY */}
                    <p className="text-xs text-sky-600 font-semibold">
                      {m.modules?.categories?.slug === "technical"
                        ? "اللغة التقنية"
                        : m.modules?.categories?.slug === "fusha"
                        ? "اللغة الفصيحة"
                        : "غير محدد"}
                    </p>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">

                    <a
                      href={m.meeting_url}
                      target="_blank"
                      className="flex items-center gap-2 text-xs bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition"
                    >
                      دخول
                      <ExternalLink size={14} />
                    </a>

                    <form
                      action={async () => {
                        "use server";
                        await deleteMeeting(m.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 border border-red-200 text-red-500 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-sm">
            لا توجد اجتماعات حالياً
          </div>
        )}

      </div>
    </div>
  );
}