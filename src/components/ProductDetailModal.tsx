"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/db";
import { formatNpr, buildWhatsAppOrderUrl } from "@/lib/constants";
import { X, MessageCircle, ArrowLeft } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  // Close on Escape key press and prevent body scroll when modal is open
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const isAvailable = product.availability === "available";
  const primaryImage = product.images?.[0] || "/images/necklace.jpg";
  const whatsAppUrl = buildWhatsAppOrderUrl(product);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-[#B88632]/30 w-full max-w-sm sm:max-w-md overflow-hidden shadow-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header bar with Back button and Close X */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-[#FAF6EE]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs text-[#736453] hover:text-[#211A14] font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="p-1 rounded-full text-stone-500 hover:text-[#211A14] hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Larger Product Image */}
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#FAF6EE] border border-stone-100">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 90vw, 420px"
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
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-medium text-[#736453] bg-stone-100 px-2 py-0.5 rounded">
                Ref: {product.reference}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-stone-100 text-stone-600 border border-stone-200"
                }`}
              >
                {isAvailable ? "Available" : "Sold Out"}
              </span>
            </div>

            <h2
              id="modal-product-name"
              className="font-serif text-lg sm:text-xl font-bold text-[#211A14] leading-snug"
            >
              {product.name}
            </h2>

            <div className="font-serif text-lg sm:text-xl font-bold text-[#B88632]">
              {formatNpr(product.price)}
            </div>

            {product.description && (
              <p className="text-xs sm:text-sm text-[#736453] leading-relaxed pt-1 border-t border-stone-100">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/70">
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
  );
}
