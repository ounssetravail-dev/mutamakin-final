"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMedia(params?: {
  language?: string;
  type?: string;
  module_id?: string;
  specializationId?: string;
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
    .in("type", ["video", "podcast"])
    .order("created_at", { ascending: false });

  if (params?.type) {
    query = query.eq("type", params.type);
  }

  if (params?.module_id) {
    query = query.eq("module_id", params.module_id);
  }

  if (params?.specializationId) {
    query = query.eq("specialization_id", params.specializationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    return [];
  }

  let result = ((data || []) as unknown) as any[];

  if (params?.language) {
    result = result.filter(
      (item) =>
        item.modules?.categories?.slug === params.language
    );
  }

  return result;
}

export async function getMediaById(id: string) {
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
    .in("type", ["video", "podcast"])
    .single();

  if (error || !data) return null;

  const item = data as any;

  if (item.source_type === "youtube") {
    return {
      ...item,
      embed_url: getYouTubeEmbed(item.url),
    };
  }

  return item;
}

export async function createMedia(payload: {
  title: string;
  type: "video" | "podcast" | "article" | "book";
  url: string;
  module_id?: string;
  thumbnail_url?: string;
  source_type?: "upload" | "youtube";
  specialization_id?: string;
}) {
  const supabase = await createClient();

  const insertData = {
    title: payload.title,
    type: payload.type,
    url: payload.url,
    module_id: payload.module_id || null,
    thumbnail_url: payload.thumbnail_url || null,
    source_type: payload.source_type || "upload",
    specialization_id: payload.specialization_id || null,
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

export async function updateMedia(
  id: string,
  payload: Partial<{
    title: string;
    url: string;
    type: string;
    thumbnail_url: string;
    source_type: string;
    module_id: string;
    specialization_id: string;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media_resources")
    .update(payload as unknown as never)
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

export async function deleteMedia(id: string) {
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

function getYouTubeEmbed(url: string) {
  try {
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
}

function revalidate() {
  revalidatePath("/media");
  revalidatePath("/Admin/media");
}