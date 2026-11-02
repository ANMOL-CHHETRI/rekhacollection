import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById, getProductByReference } from "@/lib/db";
import { formatNpr, buildWhatsAppOrderUrl } from "@/lib/constants";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    product = getProductByReference(id.toUpperCase());
  }

  if (!product || product.availability === "hidden") {
    return {
      title: "Product Not Found | Rekha Collection",
    };
  }

  const primaryImage = product.images?.[0] || "/rekha-logo.png";

  return {
    title: `${product.name} | Rekha Collection`,
    description: `${product.name} - ${formatNpr(product.price)}. Cash on delivery throughout Nepal. Order via WhatsApp.`,
    openGraph: {
      title: `${product.name} | Rekha Collection`,
      description: `${product.name} - ${formatNpr(product.price)}. Cash on delivery throughout Nepal.`,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    product = getProductByReference(id.toUpperCase());
  }

  if (!product || product.availability === "hidden") {
    notFound();
  }

  const isAvailable = product.availability === "available";
  const primaryImage = product.images?.[0] || "/images/necklace.jpg";
  const whatsAppUrl = buildWhatsAppOrderUrl(product);

  return (
    <div className="py-6 sm:py-10 px-4 max-w-lg mx-auto">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#736453] hover:text-[#211A14] transition-colors bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jewellery Menu</span>
        </Link>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-xl border border-[#B88632]/30 overflow-hidden shadow-sm">
        {/* Larger Product Image */}
        <div className="relative aspect-square w-full bg-[#FAF6EE]">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            priority
            className="object-cover object-center"
          />
          {!isAvailable && (
            <div className="absolute top-3 left-3 bg-[#211A14]/90 text-white text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded">
              Sold Out
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-medium text-[#736453] bg-stone-100 px-2 py-0.5 rounded">
              Ref: {product.reference}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-stone-100 text-stone-600 border border-stone-200"
              }`}
            >
              {isAvailable ? "Available" : "Sold Out"}
            </span>
          </div>

          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#211A14] leading-snug">
            {product.name}
          </h1>

          <div className="font-serif text-xl sm:text-2xl font-bold text-[#B88632]">
            {formatNpr(product.price)}
          </div>

          {product.description && (
            <p className="text-xs sm:text-sm text-[#736453] leading-relaxed pt-2 border-t border-stone-100">
              {product.description}
            </p>
          )}

          {/* Order Action Button */}
          <div className="pt-3">
            {isAvailable ? (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#211A14] hover:bg-[#B88632] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                <span>Order on WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-lg bg-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-wider cursor-not-allowed"
              >
                Item Currently Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
