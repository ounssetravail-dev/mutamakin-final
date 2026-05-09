"use client";

import { useState } from "react";
import { submitExercise } from "@/services/exerciseService";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export default function QuizEngine({
  exerciseId,
  questions,
  title,
  xpReward,
  passingScore,
}: any) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-slate-400">
        لا توجد أسئلة
      </div>
    );
  }

  const current = questions[index];

  function select(option: string) {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: option,
    }));
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }

  function prev() {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await submitExercise(exerciseId, answers);
      setResult(res);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  if (result) {
    return (
      <div className="text-center space-y-6 py-10">
        <h2 className="text-2xl font-bold">
          {result.passed ? "نجحت 🎉" : "حاول مرة أخرى"}
        </h2>

        <p className="text-lg">
          النتيجة: {result.score}%
        </p>

        <p className="text-xs text-slate-400">
          {result.correct} / {result.total} إجابات صحيحة
        </p>

        {result.passed && (
          <p className="text-sm text-emerald-600">
            +{xpReward} XP
          </p>
        )}

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-sky-500 text-white rounded-md"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm text-slate-500">
          سؤال {index + 1} من {questions.length}
        </p>
      </div>

      <div className="p-6 border border-slate-100 rounded-lg text-center">
        <p className="font-semibold">
          {current.question_text}
        </p>
      </div>

      <div className="space-y-3">
        {current.options.map((opt: string, i: number) => {
          const selected = answers[current.id] === opt;

          return (
            <button
              key={i}
              onClick={() => select(opt)}
              className={`w-full text-right p-4 rounded-md border transition ${
                selected
                  ? "bg-sky-50 border-sky-500"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t">

        <button
          onClick={prev}
          disabled={index === 0}
          className="text-sm text-slate-400 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>

        {index === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length !== questions.length}
            className="bg-sky-500 text-white px-6 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={14} />}
            إرسال
          </button>
        ) : (
          <button
            onClick={next}
            disabled={!answers[current.id]}
            className="bg-slate-900 text-white px-6 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            التالي <ChevronLeft size={16} />
          </button>
        )}

      </div>
    </div>
  );
}