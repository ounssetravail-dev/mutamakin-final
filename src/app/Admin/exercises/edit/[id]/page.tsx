"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getExerciseById } from "@/services/exerciseService";
import { createClient } from "@/utils/supabase/client";

export default function EditExercisePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const data = await getExerciseById(id);

      if (!data) {
        router.push("/admin/exercises");
        return;
      }

      setTitle((data as any).title);
      setQuestions(((data as any).questions || []) as any[]);
      setLoading(false);
    }

    load();
  }, [id]);

  function updateQuestion(i: number, value: string) {
    const q = [...questions];
    q[i].question_text = value;
    setQuestions(q);
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const q = [...questions];
    q[qIndex].options[oIndex] = value;
    setQuestions(q);
  }

  function setCorrect(qIndex: number, value: string) {
    const q = [...questions];
    q[qIndex].correct_answer = value;
    setQuestions(q);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title) {
      alert("يرجى إدخال العنوان");
      return;
    }

    setSaving(true);

    try {
      await supabase
        .from("exercises")
        .update({ title } as unknown as never)
        .eq("id", id);

      await supabase
        .from("questions")
        .delete()
        .eq("exercise_id", id);

      for (const q of questions) {
        await supabase
          .from("questions")
          .insert([
            {
              exercise_id: id,
              question_text: q.question_text,
              options: q.options,
              correct_answer: q.correct_answer,
            },
          ] as unknown as never[]);
      }

      router.push("/admin/exercises");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    }

    setSaving(false);
  }

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">

      <h1 className="text-xl font-bold">
        تعديل التمرين
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-md"
        />

        {questions.map((q, i) => (
          <div key={i} className="border p-4 rounded-md space-y-2">

            <input
              type="text"
              value={q.question_text}
              onChange={(e) => updateQuestion(i, e.target.value)}
              className="w-full border p-2"
            />

            {q.options.map((opt: string, j: number) => (
              <input
                key={j}
                type="text"
                value={opt}
                onChange={(e) =>
                  updateOption(i, j, e.target.value)
                }
                className="w-full border p-2"
              />
            ))}

            <input
              type="text"
              value={q.correct_answer}
              onChange={(e) =>
                setCorrect(i, e.target.value)
              }
              className="w-full border p-2"
            />

          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-500 text-white py-3 rounded-md"
        >
          {saving ? "جارٍ الحفظ..." : "تحديث"}
        </button>

      </form>

    </div>
  );
}