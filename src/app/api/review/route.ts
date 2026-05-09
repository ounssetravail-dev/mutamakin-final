import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const supabase = await createClient();

  const formData = await req.formData();

  const content = (formData.get("content") as string)?.trim();
  const rating = Number(formData.get("rating"));

  if (!content || !rating || rating < 1 || rating > 5) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("reviews")
      .update({
        content,
        rating,
      } as unknown as never)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    const { error } = await supabase.from("reviews").insert([
      {
        content,
        rating,
        user_id: user.id,
      },
    ]);

    if (error) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  revalidatePath("/");
  return NextResponse.redirect(new URL("/", req.url));
}