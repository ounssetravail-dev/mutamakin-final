import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const base64 = body.file;

    const matches = base64.match(/^data:(.+);base64,(.*)$/);
    if (!matches) {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      );
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    let ext = "bin";

    if (mime.includes("pdf")) ext = "pdf";
    else if (mime.includes("image/jpeg")) ext = "jpg";
    else if (mime.includes("image/png")) ext = "png";
    else if (mime.includes("image/webp")) ext = "webp";
    else if (mime.includes("video/mp4")) ext = "mp4";
    else if (mime.includes("video/webm")) ext = "webm";

    const fileName = `mutamakin/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(fileName, buffer, {
        contentType: mime,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("files")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    let finalUrl = publicUrl;

    if (mime.includes("pdf")) {
      finalUrl = `https://docs.google.com/gview?url=${encodeURIComponent(publicUrl)}&embedded=true`;
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      original_url: publicUrl,
      type: mime,
      path: fileName,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}