import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  getAllProducts,
  getProductStats,
  createProduct,
  getProductByReference,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const products = getAllProducts(true);
  const stats = getProductStats();

  return NextResponse.json({ products, stats });
}

export async function POST(req: NextRequest) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { reference, name, price, images, category, description, availability, featured } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Valid product name is required." }, { status: 400 });
    }

    if (!reference || typeof reference !== "string" || reference.trim().length < 2) {
      return NextResponse.json(
        { error: "Valid unique product reference is required (e.g. RC-101)." },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: "Product price must be a positive number in NPR." },
        { status: 400 }
      );
    }

    const existing = getProductByReference(reference.trim().toUpperCase());
    if (existing) {
      return NextResponse.json(
        { error: `A product with reference "${reference.trim().toUpperCase()}" already exists.` },
        { status: 400 }
      );
    }

    const validAvailability = ["available", "sold_out", "hidden"].includes(availability)
      ? availability
      : "available";

    const product = createProduct({
      reference,
      name,
      price: numericPrice,
      images: Array.isArray(images) && images.length > 0 ? images : ["/images/necklace.jpg"],
      category: category || "Necklaces & Sets",
      description: description || "",
      availability: validAvailability,
      featured: Boolean(featured),
      is_demo: false, // User created items are real inventory
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("[Create Product Error]", error);
    return NextResponse.json(
      { error: "Failed to create product in database." },
      { status: 500 }
    );
  }
}
