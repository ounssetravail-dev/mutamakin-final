import { getExercises, deleteExercise } from "@/services/exerciseService";
import Link from "next/link";
import {
  Brain,
  Trash2,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminExercisesPage() {
  const exercises = await getExercises();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              إدارة التمارين
            </h1>
            <p className="text-sm text-slate-500">
              إنشاء وتعديل التمارين
            </p>
          </div>

          <Link
            href="/Admin/exercises/new"
            className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm"
          >
            إضافة تمرين
          </Link>
        </div>

        {exercises.length > 0 ? (
          <div className="space-y-4">

            {exercises.map((ex: any) => (
              <div
                key={ex.id}
                className="border border-slate-100 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {ex.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {ex.xp_reward} XP • نجاح عند {ex.passing_score}%
                  </p>

                  <p className="text-xs text-sky-600 font-semibold">
                    {ex.modules?.categories?.slug === "technical"
                      ? "اللغة التقنية"
                      : ex.modules?.categories?.slug === "fusha"
                      ? "اللغة الفصيحة"
                      : "غير محدد"}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <Link
                    href={`/Admin/exercises/edit/${ex.id}`}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    تعديل
                  </Link>

                  <form action={deleteExercise.bind(null, ex.id)}>
                    <button
                      type="submit"
                      className="p-2 text-red-500 border border-red-200 rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>

                  <a
                    href={`/exercises/${ex.id}`}
                    target="_blank"
                    className="p-2 border rounded-md"
                  >
                    <ExternalLink size={14} />
                  </a>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            لا توجد تمارين
          </div>
        )}

      </div>
    </div>
  );
}