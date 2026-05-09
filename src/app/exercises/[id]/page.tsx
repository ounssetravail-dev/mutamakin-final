import { getExerciseById } from "@/services/exerciseService";
import QuizEngine from "@/components/exercises/QuizEngine";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const exercise = await getExerciseById(id);

  if (!exercise || !exercise.module_id) {
    notFound();
  }

  const questions = Array.isArray(exercise.questions)
    ? exercise.questions
    : [];

  const passingScore = exercise.passing_score ?? 70;
  const xp = exercise.xp_reward ?? 10;

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <div className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <Link
            href="/exercises"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700"
          >
            <ArrowRight size={14} />
            العودة
          </Link>

          <span className="text-xs text-slate-400">
            +{xp} XP
          </span>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BrainCircuit className="text-sky-500" />
            <h1 className="text-xl font-bold">
              {exercise.title}
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            عدد الأسئلة: {questions.length} • النجاح عند {passingScore}%
          </p>
        </div>

        <div className="border border-slate-100 rounded-xl p-4 md:p-6 shadow-sm">
          <QuizEngine
            exerciseId={exercise.id}
            questions={questions}
            title={exercise.title}
            passingScore={passingScore}
            xpReward={xp}
            moduleId={exercise.module_id}
            category={exercise.modules?.categories?.slug}
          />
        </div>

      </div>
    </div>
  );
}