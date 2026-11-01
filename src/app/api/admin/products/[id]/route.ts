import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByReference,
} from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { reference, name, price, images, category, description, availability, featured } = body;

    if (reference && reference.trim().toUpperCase() !== existing.reference) {
      const duplicate = getProductByReference(reference.trim().toUpperCase());
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Product reference "${reference.trim().toUpperCase()}" is already in use.` },
          { status: 400 }
        );
      }
    }

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return NextResponse.json(
          { error: "Price must be a positive number in NPR." },
          { status: 400 }
        );
      }
    }

    const updated = updateProduct(id, {
      reference,
      name,
      price: price !== undefined ? Number(price) : undefined,
      images,
      category,
      description,
      availability,
      featured,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("[Update Product Error]", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const success = deleteProduct(id);
  return NextResponse.json({ success });
}
