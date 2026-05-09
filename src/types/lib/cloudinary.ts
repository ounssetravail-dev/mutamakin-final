"use server";

import { v2 as cloudinary } from "cloudinary";

/**
 * 🔐 Cloudinary Config
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 🎯 Upload ANY file (video / image / pdf)
 */
export async function uploadFile(file: string) {
  try {
    let resourceType: "image" | "video" | "raw" = "image";

    // 🔥 تحديد نوع الملف
    if (file.startsWith("data:video")) {
      resourceType = "video";
    } else if (file.startsWith("data:image")) {
      resourceType = "image";
    } else if (file.startsWith("data:application/pdf")) {
      resourceType = "raw";
    }

    const result = await cloudinary.uploader.upload(file, {
      resource_type: resourceType,
      folder: "mutamakin",
    });

    return {
      success: true,
      url: result.secure_url,
      thumbnail:
        resourceType === "video"
          ? result.secure_url.replace(/\.[^/.]+$/, ".jpg")
          : result.secure_url,
      type: resourceType,
    };

  } catch (error) {
    console.error("Cloudinary Error:", error);

    return {
      success: false,
      error: "Upload failed",
    };
  }
}