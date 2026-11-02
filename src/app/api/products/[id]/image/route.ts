import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProductByReference } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let product = getProductById(id);
    if (!product) {
      product = getProductByReference(id);
    }

    if (!product || !product.images || product.images.length === 0) {
      return NextResponse.redirect(new URL("/rekha-logo.png", req.url));
    }

    const primaryImg = product.images[0];

    // Handle Base64 data URLs
    if (primaryImg.startsWith("data:")) {
      const match = primaryImg.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const buffer = Buffer.from(match[2], "base64");
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
          },
        });
      }
    }

    // Handle external full URLs
    if (primaryImg.startsWith("http://") || primaryImg.startsWith("https://")) {
      return NextResponse.redirect(primaryImg);
    }

    // Handle relative local paths (e.g. /images/necklace.jpg)
    const cleanPath = primaryImg.startsWith("/") ? primaryImg : `/${primaryImg}`;
    return NextResponse.redirect(new URL(cleanPath, req.url));
  } catch (error) {
    console.error("[Product Image Proxy Error]", error);
    return NextResponse.redirect(new URL("/rekha-logo.png", req.url));
  }
}
