"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getExercises(params?: {
  language?: string;
  module_id?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select(`
      id,
      title,
      xp_reward,
      passing_score,
      created_at,
      module_id,
      modules (
        id,
        categories (
          slug,
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  let result = ((data || []) as unknown) as any[];

  result = result.filter((ex: any) => ex.module_id);

  if (params?.module_id) {
    result = result.filter(
      (ex: any) => ex.module_id === params.module_id
    );
  }

  if (params?.language) {
    result = result.filter(
      (ex: any) =>
        ex.modules?.categories?.slug === params.language
    );
  }

  return result;
}

export async function getExerciseById(id: string) {
  const supabase = await createClient();

  const { data: exercise } = await supabase
    .from("exercises")
    .select(`
      id,
      title,
      xp_reward,
      passing_score,
      module_id,
      modules (
        id,
        categories (
          slug,
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  const exerciseData = exercise as any;

  if (!exerciseData || !exerciseData.module_id) return null;

  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, options, correct_answer")
    .eq("exercise_id", id);

  return {
    ...exerciseData,
    questions: ((questions || []) as unknown) as any[],
  };
}

export async function submitExercise(
  exerciseId: string,
  answers: Record<string, string>
) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) throw new Error("Not logged in");

  const exercise = await getExerciseById(exerciseId);
  if (!exercise) throw new Error("Exercise not found");

  let correct = 0;

  for (const q of exercise.questions) {
    if (answers[q.id] === q.correct_answer) {
      correct++;
    }
  }

  const total = exercise.questions.length || 1;
  const score = Math.round((correct / total) * 100);
  const passed = score >= exercise.passing_score;

  await supabase
    .from("exercise_submissions")
    .insert([
      {
        user_id: user.id,
        exercise_id: exerciseId,
        score,
        passed,
        xp_earned: passed ? exercise.xp_reward : 0,
      },
    ] as unknown as never[]);

  if (passed) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", user.id)
      .single();

    const currentXP = (profile as any)?.xp || 0;

    await supabase
      .from("profiles")
      .update({
        xp: currentXP + exercise.xp_reward,
      } as unknown as never)
      .eq("id", user.id);
  }

  revalidatePaths(exerciseId);

  return { score, passed, correct, total };
}

export async function getUserResults() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return [];

  const { data } = await supabase
    .from("exercise_submissions")
    .select("id, score, passed, created_at, exercise_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data || []) as unknown) as any[];
}

export async function createExercise(payload: {
  title: string;
  module_id: string;
}) {
  const supabase = await createClient();

  if (!payload.module_id) {
    throw new Error("module_id is required");
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert([
      {
        title: payload.title,
        module_id: payload.module_id,
        xp_reward: 10,
        passing_score: 70,
      },
    ] as unknown as never[])
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePaths();
  return data;
}

export async function deleteExercise(id: string) {
  const supabase = await createClient();

  await supabase.from("exercises").delete().eq("id", id);
  await supabase.from("questions").delete().eq("exercise_id", id);

  revalidatePaths();
}

function revalidatePaths(id?: string) {
  revalidatePath("/exercises");
  revalidatePath("/dashboard");

  if (id) {
    revalidatePath(`/exercises/${id}`);
  }
}