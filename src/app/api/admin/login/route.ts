import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const verification = verifyAdminCredentials(username, password, clientIp);

    if (!verification.success || !verification.admin) {
      return NextResponse.json(
        { error: verification.error || "Authentication failed." },
        { status: 401 }
      );
    }

    // Session token valid for 7 days
    const now = Date.now();
    const sessionCookie = createSessionCookie({
      adminId: verification.admin.id,
      username: verification.admin.username,
      issuedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json({
      success: true,
      admin: verification.admin,
    });

    response.cookies.set(sessionCookie);

    return response;
  } catch (error) {
    console.error("[Auth API Login Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
