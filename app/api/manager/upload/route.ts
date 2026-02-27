/**
 * API Route: Upload image to Supabase Storage
 * POST /api/manager/upload
 * 
 * Upload logo or cover images for canteen during onboarding
 * Requires authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!folder || !["logos", "covers", "menu"].includes(folder)) {
      return NextResponse.json(
        { error: "Invalid folder specified" },
        { status: 400 }
      );
    }

    // In this project, `folder` is actually the bucket name (matches Supabase dashboard)
    const bucket = folder;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG and JPG files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = folder === "covers" ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for covers, 5MB for logos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase Storage upload requires server credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart the dev server.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    try {
      // Helpful debug for bucket/project mismatches (no secrets)
      console.log("[upload] project host:", new URL(supabaseUrl).host);
      console.log("[upload] bucket:", bucket);
    } catch {
      // ignore
    }

    const timestamp = Date.now();
    const safeName = sanitizeFilename(file.name);
    const objectPath = `${userId}/${timestamp}-${safeName}`;

    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: file.type });

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, blob, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      
      // Check for connection timeout specifically
      if (uploadError.message && (uploadError.message.includes("fetch failed") || uploadError.message.includes("undici"))) {
         return NextResponse.json(
          {
            error: "Connection to Supabase failed. Please check your internet connection and ensure your Supabase project is not paused.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error:
            uploadError.message ||
            "Failed to upload image to storage. Check bucket policies/credentials.",
        },
        { status: 500 }
      );
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);

    if (!publicData?.publicUrl) {
      return NextResponse.json(
        { error: "Upload succeeded but failed to generate public URL" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: publicData.publicUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// App Router route configuration (not Pages Router)
export const maxDuration = 60;

// Ensure this runs on the Node.js runtime (service role keys must never run on Edge)
export const runtime = "nodejs";
