"use server";

import { createClient } from "@/utils/supabase/server";

export const getSpecializations = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("specializations")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getSpecializationsByLanguage = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("specializations")
    .select(`
      *,
      categories!inner (
        id,
        name,
        slug
      )
    `)
    .eq("categories.slug", slug)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getSpecializationById = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("specializations")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createSpecialization = async ({
  name,
  category_id,
}: {
  name: string;
  category_id: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("specializations")
    .insert([
      {
        name,
        category_id,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSpecialization = async (
  id: string,
  payload: Partial<{
    name: string;
    category_id: string;
  }>
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("specializations")
    .update(payload as unknown as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSpecialization = async (id: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("specializations")
    .delete()
    .eq("id", id);

  if (error) throw error;
};