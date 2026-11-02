import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowed size of 8MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
    );

    if (isServerless) {
      // In serverless environments with read-only filesystem, convert to base64 data URL
      const base64 = buffer.toString("base64");
      const mime = file.type || "image/jpeg";
      const dataUrl = `data:${mime};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: file.name,
      });
    }

    // Local environment: save to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Determine extension
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const uniqueName = `rekha_${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
    });
  } catch (error) {
    console.error("[Upload Error]", error);
    return NextResponse.json(
      { error: "Failed to upload image file." },
      { status: 500 }
    );
  }
}
