"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/db";
import { formatNpr, buildWhatsAppOrderUrl } from "@/lib/constants";
import { MessageCircle, ArrowUpRight, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.availability === "available";
  const primaryImage = product.images?.[0] || "/images/necklace.jpg";
  const whatsAppUrl = buildWhatsAppOrderUrl(product);

  return (
    <div className="group flex flex-col bg-white rounded-lg overflow-hidden border border-[#B88632]/20 hover:border-[#B88632] transition-all duration-300 luxury-shadow luxury-shadow-hover relative">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {/* Availability Badge */}
        {isAvailable ? (
          <span className="bg-[#211A14]/90 backdrop-blur-md text-[#E8C99F] text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded shadow-sm border border-[#B88632]/40">
            Available
          </span>
        ) : (
          <span className="bg-stone-800/95 backdrop-blur-md text-stone-300 text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded shadow-sm">
            Sold Out
          </span>
        )}

        {/* Demo Product Indicator */}
        {product.is_demo && (
          <span className="bg-[#FAF6EE]/95 backdrop-blur-md text-[#8F641B] text-[9px] tracking-wider uppercase font-medium px-1.5 py-0.5 rounded shadow-sm border border-[#E8C99F]">
            Demo Sample
          </span>
        )}
      </div>

      {/* Product Reference Badge top-right */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="bg-white/90 backdrop-blur-md text-[#211A14] text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-[#E8C99F]/60 shadow-sm">
          {product.reference}
        </span>
      </div>

      {/* Square Product Image Container */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square w-full overflow-hidden bg-[#FAF6EE] focus:outline-none"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-[#211A14]/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-[#211A14] text-[#FAF6EE] text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded border border-[#B88632]">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-[#B88632] uppercase tracking-widest font-medium mb-1">
            {product.category}
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#211A14] line-clamp-2 hover:text-[#B88632] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase text-stone-600 tracking-wider font-medium">Price</div>
            <div className="font-serif text-sm sm:text-base font-bold text-[#211A14]">
              {formatNpr(product.price)}
            </div>
          </div>

          {/* Action Button */}
          {isAvailable ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Order on WhatsApp"
              className="inline-flex items-center gap-1.5 bg-[#211A14] hover:bg-[#B88632] text-white text-xs px-2.5 py-1.5 rounded transition-colors shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline font-medium">Order</span>
            </a>
          ) : (
            <Link
              href={`/product/${product.id}`}
              className="inline-flex items-center gap-1 text-stone-600 hover:text-[#211A14] text-xs font-medium"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
