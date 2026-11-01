import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProductByReference, getRelatedProducts } from "@/lib/db";
import { BRAND, formatNpr } from "@/lib/constants";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import ProductCard from "@/components/ProductCard";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle,
} from "lucide-react";

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
    title: `${product.name} (${product.reference}) | Rekha Collection Butwal`,
    description: `${product.name} - ${formatNpr(product.price)}. Unique reference: ${
      product.reference
    }. Available with Cash on delivery all over Nepal from Rekha Collection, Butwal.`,
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

  const relatedProducts = getRelatedProducts(product.category, product.id, 4);
  const isAvailable = product.availability === "available";

  return (
    <div className="py-8 sm:py-14 bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#736453] mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#211A14] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/collection" className="hover:text-[#211A14] transition-colors">
            Collection
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#B88632]">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#211A14] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-xl p-6 sm:p-10 border border-[#B88632]/25 luxury-shadow">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} productName={product.name} />

            {product.is_demo && (
              <div className="mt-4 p-3 rounded-md bg-[#FAF6EE] border border-[#E8C99F] text-xs text-[#8F641B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B88632] shrink-0" />
                <span>
                  <strong>Sample Design:</strong> This is an illustrative preview item for demonstration.
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Reference Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#B88632]">
                  {product.category}
                </span>
                <span className="text-xs font-mono bg-stone-100 text-[#211A14] px-2.5 py-1 rounded border border-stone-200">
                  REF: <strong>{product.reference}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#211A14] leading-tight">
                {product.name}
              </h1>

              {/* Price & Availability */}
              <div className="flex items-center gap-4 py-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#211A14]">
                  {formatNpr(product.price)}
                </span>
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available in Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-2 text-sm text-[#736453] leading-relaxed border-t border-stone-100">
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-[#211A14] mb-1.5">
                    Description & Details
                  </h2>
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100 text-xs text-[#211A14]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B88632]" />
                  <span>Handcrafted Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B88632]" />
                  <span>Nepal Nationwide COD</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B88632]" />
                  <span>Personal WhatsApp Sizing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B88632]" />
                  <span>Carefully Packed & Sealed</span>
                </div>
              </div>
            </div>

            {/* Ordering CTA & Disclaimers */}
            <div className="pt-2">
              <WhatsAppOrderButton product={product} />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <div className="flex items-center justify-between mb-8 border-b border-[#E8C99F]/50 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#B88632] block">
                  Curated Suggestions
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211A14]">
                  You May Also Admire
                </h2>
              </div>
              <Link
                href="/collection"
                className="text-xs uppercase tracking-wider font-semibold text-[#211A14] hover:text-[#B88632] transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
