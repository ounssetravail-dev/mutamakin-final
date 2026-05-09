"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, xp")
    .eq("id", user.id)
    .single();

  return (data as unknown) as {
    id: string;
    full_name: string | null;
    role: "student" | "admin";
    xp: number;
  } | null;
}

export async function updateProfile(full_name: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: full_name,
    } as unknown as never)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return (data as unknown) as {
    id: string;
    full_name: string | null;
    role: "student" | "admin";
    xp: number;
  };
}

export async function isAdmin() {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function getCurrentUserId() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id || null;
}

export async function getUserReviews() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return [];

  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as unknown) as any[];
}