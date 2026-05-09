import { getMeetings } from "@/services/meetingService";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: "technical" | "fusha";
  }>;
}) {
  const params = await searchParams;
  const language = params.type || "technical";

  const meetings = await getMeetings({ language });

  function getTimeLeft(date: string) {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return null;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} ساعة`;
    return `${minutes} دقيقة`;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            الاجتماعات
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            جلسات {language === "technical" ? "تقنية" : "فصيحة"}
          </p>
        </div>

        {/* LIST */}
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {meetings.map((m: any) => {
              const date = new Date(m.scheduled_at);
              const timeLeft = getTimeLeft(m.scheduled_at);

              return (
                <div
                  key={m.id}
                  className={`border rounded-xl p-5 flex flex-col justify-between transition shadow-sm ${
                    m.status === "live"
                      ? "border-red-300 bg-red-50"
                      : "border-slate-100 hover:shadow-md"
                  }`}
                >
                  {/* INFO */}
                  <div className="space-y-3">

                    <h3 className="font-semibold text-slate-900">
                      {m.title}
                    </h3>

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
                    <div className="flex items-center justify-between">

                      <span
                        className={`text-xs font-semibold ${
                          m.status === "live"
                            ? "text-red-600"
                            : m.status === "upcoming"
                            ? "text-sky-600"
                            : "text-slate-400"
                        }`}
                      >
                        {m.status === "live"
                          ? "🔴 مباشر الآن"
                          : m.status === "upcoming"
                          ? "قريباً"
                          : "منتهية"}
                      </span>

                      {/* Countdown */}
                      {m.status === "upcoming" && timeLeft && (
                        <span className="text-xs text-slate-500">
                          بعد {timeLeft}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTION */}
                  <div className="mt-4 pt-4 border-t border-slate-100">

                    <a
                      href={m.meeting_url}
                      target="_blank"
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                        m.status === "live"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-sky-500 text-white hover:bg-sky-600"
                      }`}
                    >
                      <Video size={14} />
                      {m.status === "live"
                        ? "الدخول الآن"
                        : "دخول الجلسة"}
                      <ExternalLink size={14} />
                    </a>

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

        {/* BACK */}
        <div className="text-center pt-10">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            العودة للوحة التحكم
          </Link>
        </div>

      </div>
    </div>
  );
}