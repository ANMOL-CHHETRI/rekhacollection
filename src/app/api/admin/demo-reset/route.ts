import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { clearDemoProducts } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const deletedCount = clearDemoProducts();
    return NextResponse.json({
      success: true,
      message: `Successfully removed ${deletedCount} demonstration product(s). Catalogue now displays real inventory only.`,
    });
  } catch (error) {
    console.error("[Demo Reset Error]", error);
    return NextResponse.json(
      { error: "Failed to remove demonstration products." },
      { status: 500 }
    );
  }
}
