"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getResources(params?: {
  language?: string;
  type?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("media_resources")
    .select(`
      *,
      modules (
        id,
        categories (
          slug,
          name
        )
      )
    `)
    .in("type", ["article", "book"])
    .order("created_at", { ascending: false });

  if (params?.type) {
    query = query.eq("type", params.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    return [];
  }

  let result = ((data || []) as unknown) as any[];

  if (params?.language) {
    result = result.filter(
      (item: any) =>
        item.modules?.categories?.slug === params.language
    );
  }

  return result.map((item: any) => {
    const fileUrl = item.original_url || item.url;

    return {
      ...item,
      file_url: fileUrl,
      is_pdf: fileUrl?.toLowerCase().includes(".pdf"),
      is_image: fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i),
    };
  });
}

export async function getResourceById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media_resources")
    .select(`
      *,
      modules (
        id,
        categories (
          slug,
          name
        )
      )
    `)
    .eq("id", id)
    .in("type", ["article", "book"])
    .single();

  if (error || !data) return null;

  const item = data as any;
  const fileUrl = item.original_url || item.url;

  return {
    ...item,
    file_url: fileUrl,
    is_pdf: fileUrl?.toLowerCase().includes(".pdf"),
    is_image: fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i),
  };
}

export async function createResource(payload: {
  title: string;
  type: "article" | "book";
  url?: string;
  original_url?: string;
  content?: string;
  module_id: string;
  thumbnail_url?: string;
}) {
  const supabase = await createClient();

  const insertData = {
    title: payload.title,
    type: payload.type,
    url: payload.url || "",
    original_url: payload.original_url || payload.url || "",
    content: payload.content || "",
    module_id: payload.module_id,
    thumbnail_url: payload.thumbnail_url || null,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("media_resources")
    .insert([insertData] as unknown as never[])
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidate();
  return data;
}

export async function updateResource(
  id: string,
  payload: Partial<{
    title: string;
    content: string;
    url: string;
    original_url: string;
    module_id: string;
    thumbnail_url: string;
  }>
) {
  const supabase = await createClient();

  const updateData = {
    ...payload,
    original_url: payload.original_url || payload.url,
  };

  const { data, error } = await supabase
    .from("media_resources")
    .update(updateData as unknown as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidate();
  return data;
}

export async function deleteResource(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("media_resources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidate();
}

function revalidate() {
  revalidatePath("/resources");
  revalidatePath("/Admin/resources");
}