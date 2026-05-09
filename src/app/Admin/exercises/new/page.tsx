"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createExercise } from "@/services/exerciseService";
import { createClient } from "@/utils/supabase/client";
import { PlusCircle, Brain, CheckCircle2 } from "lucide-react";

export default function NewExercisePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");

  const [modules, setModules] = useState<any[]>([]);
  const [moduleId, setModuleId] = useState("");

  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", ""], correct: "" },
  ]);

  useEffect(() => {
    async function loadModules() {
      const { data } = await supabase
        .from("modules")
        .select(`
          id,
          title,
          categories (
            slug
          )
        `);

      setModules((data || []) as any[]);
    }

    loadModules();
  }, []);

  useEffect(() => {
    if (!language) return;

    async function loadModule() {
      const { data } = await supabase
        .from("modules")
        .select("id, categories!inner(slug)")
        .eq("categories.slug", language)
        .limit(1);

      if (data && data.length > 0) {
        setModuleId((data as any)[0].id);
      }
    }

    loadModule();
  }, [language]);

  function addQuestion() {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", ""], correct: "" },
    ]);
  }

  function updateQuestion(i: number, value: string) {
    const q = [...questions];
    q[i].text = value;
    setQuestions(q);
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const q = [...questions];
    q[qIndex].options[oIndex] = value;
    setQuestions(q);
  }

  function setCorrect(qIndex: number, value: string) {
    const q = [...questions];
    q[qIndex].correct = value;
    setQuestions(q);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !moduleId) {
      alert("يرجى إدخال العنوان واختيار القسم");
      return;
    }

    setLoading(true);

    try {
      const exercise = await createExercise({
        title,
        module_id: moduleId,
      });

      const exerciseData = exercise as any;

      for (const q of questions) {
        await supabase.from("questions").insert([
          {
            exercise_id: exerciseData.id,
            question_text: q.text,
            options: q.options,
            correct_answer: q.correct,
          },
        ] as unknown as never[]);
      }

      router.push("/Admin/exercises");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10">

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Brain className="text-sky-500" />
          إنشاء تمرين جديد
        </h1>
        <p className="text-sm text-slate-500">
          أنشئ أسئلة تفاعلية لطلابك بسهولة
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        <input
          type="text"
          placeholder="عنوان التمرين"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-4 rounded-lg text-lg"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border p-3 rounded-lg text-sm text-slate-700"
        >
          <option value="">اختر القسم</option>
          <option value="technical">اللغة التقنية</option>
          <option value="fusha">اللغة الفصيحة</option>
        </select>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border border-slate-100 rounded-xl p-6 space-y-4 shadow-sm"
            >

              <input
                type="text"
                placeholder={`السؤال ${i + 1}`}
                value={q.text}
                onChange={(e) => updateQuestion(i, e.target.value)}
                className="w-full border p-3 rounded-md"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {q.options.map((opt, j) => (
                  <input
                    key={j}
                    type="text"
                    placeholder={`خيار ${j + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateOption(i, j, e.target.value)
                    }
                    className="w-full border p-3 rounded-md"
                  />
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="الإجابة الصحيحة"
                  value={q.correct}
                  onChange={(e) =>
                    setCorrect(i, e.target.value)
                  }
                  className="flex-1 border p-3 rounded-md"
                />

                {q.correct && (
                  <CheckCircle2 className="text-green-500" />
                )}
              </div>

            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 text-sky-600"
        >
          <PlusCircle />
          إضافة سؤال
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-sky-600 transition"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ التمرين"}
        </button>

      </form>

    </div>
  );
}