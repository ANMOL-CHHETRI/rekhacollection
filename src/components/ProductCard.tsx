"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/db";
import { formatNpr, buildWhatsAppOrderUrl } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const isAvailable = product.availability === "available";
  const primaryImage = product.images?.[0] || "/images/necklace.jpg";
  const whatsAppUrl = buildWhatsAppOrderUrl(product);

  return (
    <article
      onClick={() => onSelect(product)}
      className="group bg-white rounded-lg border border-[#B88632]/25 overflow-hidden flex flex-col justify-between transition-colors hover:border-[#B88632] cursor-pointer"
    >
      {/* Square Product Image */}
      <div className="relative aspect-square w-full bg-[#FAF6EE] overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-103"
        />

        {/* Status badge: subtle indicator */}
        {!isAvailable ? (
          <div className="absolute top-2 left-2 z-10 bg-[#211A14]/85 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
            Sold Out
          </div>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
        {/* Product Name */}
        <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#211A14] line-clamp-2 leading-snug group-hover:text-[#B88632] transition-colors">
          {product.name}
        </h3>

        {/* Price and Order Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
          <div className="font-serif text-xs sm:text-sm font-bold text-[#B88632] whitespace-nowrap">
            {formatNpr(product.price)}
          </div>

          {/* Order Button */}
          {isAvailable ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Order ${product.name} on WhatsApp`}
              className="inline-flex items-center gap-1 bg-[#211A14] hover:bg-[#B88632] text-white text-[11px] font-medium px-2.5 py-1 rounded transition-colors shrink-0 shadow-xs active:scale-95"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366] fill-current" />
              <span>Order</span>
            </a>
          ) : (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center bg-stone-200 text-stone-500 text-[10px] font-medium px-2 py-1 rounded cursor-not-allowed shrink-0"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
