import { getExercises, getUserResults } from "@/services/exerciseService";
import {
  BrainCircuit,
  ChevronLeft,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams?: {
    type?: string;
  };
}) {
  const language =
    searchParams?.type === "fusha"
      ? "fusha"
      : "technical";

  const [exercises, results] = await Promise.all([
    getExercises({ language }),
    getUserResults(),
  ]);

  const completedIds = results.map((r: any) => r.exercise_id);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        <header className="py-12 border-b border-slate-100 mb-10">
          <h1 className="text-3xl font-bold">
            بنك التمارين
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            تمارين {language === "technical" ? "تقنية" : "فصيحة"}
          </p>
        </header>

        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {exercises.map((ex: any) => {
              const isCompleted = completedIds.includes(ex.id);

              return (
                <div
                  key={ex.id}
                  className="group border border-slate-100 rounded-xl p-5 hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg group-hover:bg-sky-50 group-hover:text-sky-600 transition">
                        <BrainCircuit />
                      </div>

                      {isCompleted && (
                        <CheckCircle2 className="text-emerald-500" size={18} />
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      {ex.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                      نجاح عند {ex.passing_score}%
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/exercises/${ex.id}`}
                      className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-md transition ${
                        isCompleted
                          ? "bg-slate-100 text-slate-600 hover:bg-sky-500 hover:text-white"
                          : "bg-sky-500 text-white hover:bg-sky-600"
                      }`}
                    >
                      {isCompleted ? "إعادة المحاولة" : "ابدأ التمرين"}
                      <ChevronLeft size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-100 rounded-lg">
            <Search size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">
              لا توجد تمارين حالياً
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700"
          >
            <ArrowRight size={14} />
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}