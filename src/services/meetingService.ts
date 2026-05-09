"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMeetings(params?: {
  language?: string;
  module_id?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("meetings")
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
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error(error.message);
    return [];
  }

  let result = ((data || []) as unknown) as any[];

  if (params?.module_id) {
    result = result.filter(
      (m) => m.module_id === params.module_id
    );
  }

  if (params?.language) {
    result = result.filter(
      (m) =>
        m.modules?.categories?.slug === params.language
    );
  }

  return result.map(formatMeeting);
}

export async function getActiveMeetings(params?: {
  language?: string;
}) {
  const meetings = await getMeetings(params);

  return meetings.filter(
    (m) =>
      m.status === "live" || m.status === "upcoming"
  );
}

export async function createMeeting(payload: {
  title: string;
  meeting_url: string;
  scheduled_at: string;
  module_id: string;
}) {
  const supabase = await createClient();

  if (!payload.module_id) {
    throw new Error("module_id is required");
  }

  const insertData = {
    title: payload.title,
    meeting_url: payload.meeting_url,
    scheduled_at: payload.scheduled_at,
    module_id: payload.module_id,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("meetings")
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

export async function updateMeeting(
  id: string,
  payload: Partial<{
    title: string;
    meeting_url: string;
    scheduled_at: string;
    module_id: string;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("meetings")
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

export async function deleteMeeting(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("meetings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidate();
}

function formatMeeting(meeting: any) {
  const now = new Date();
  const start = new Date(meeting.scheduled_at);

  const diff = start.getTime() - now.getTime();

  let status = "upcoming";

  if (diff <= 0 && diff > -60 * 60 * 1000) {
    status = "live";
  }

  if (diff <= -60 * 60 * 1000) {
    status = "finished";
  }

  return {
    ...meeting,
    status,
    is_live: status === "live",
    is_upcoming: status === "upcoming",
    is_finished: status === "finished",
  };
}

function revalidate() {
  revalidatePath("/meetings");
  revalidatePath("/Admin/meetings");
  revalidatePath("/dashboard");
}