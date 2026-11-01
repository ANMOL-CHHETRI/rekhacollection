"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/lib/db";
import { BRAND, formatNpr } from "@/lib/constants";
import { MessageCircle, ShieldAlert, Truck, AlertCircle } from "lucide-react";

interface WhatsAppOrderButtonProps {
  product: Product;
}

export default function WhatsAppOrderButton({ product }: WhatsAppOrderButtonProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const isAvailable = product.availability === "available";

  const message = `Hello Rekha Collection! I would like to order:
Product: ${product.name}
Product Reference: ${product.reference}
Price: ${formatNpr(product.price)}
Product Link: ${currentUrl || `https://rekhacollection.com/product/${product.id}`}

Please confirm availability, delivery charge, and total payable amount.`;

  const whatsappUrl = `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;

  const restockMessage = `Hello Rekha Collection! I am interested in the sold-out item "${product.name}" (Ref: ${product.reference}). Could you please inform me if it becomes available again?`;
  const restockUrl = `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(restockMessage)}`;

  if (!isAvailable) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-md bg-stone-100 border border-stone-200 text-stone-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[#211A14]">This Item is Currently Sold Out</div>
            <p className="text-xs text-stone-600 mt-0.5">
              Orders cannot be placed for sold out jewellery pieces. You may message the owner on WhatsApp to check if a custom piece or restock is possible.
            </p>
          </div>
        </div>

        <a
          href={restockUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 py-3.5 px-6 rounded-md font-medium text-sm transition-colors border border-stone-300"
        >
          <MessageCircle className="w-4 h-4 text-stone-600" />
          <span>Inquire About Restock on WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary WhatsApp Order CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-3 bg-[#211A14] hover:bg-[#3D3228] text-white py-4 px-6 rounded-md font-serif text-base tracking-wide uppercase shadow-lg hover:shadow-xl transition-all duration-200 border border-[#B88632] group"
      >
        <span className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-5 h-5 fill-current" />
        </span>
        <span className="font-bold">Order on WhatsApp</span>
      </a>

      {/* Mandatory Brand Notice Box */}
      <div className="bg-[#FAF6EE] border border-[#B88632]/30 rounded-md p-4 space-y-2">
        <div className="flex items-start gap-2.5 text-xs text-[#211A14]">
          <Truck className="w-4 h-4 text-[#B88632] shrink-0 mt-0.5" />
          <span className="font-semibold">{BRAND.codNotice}</span>
        </div>
        <p className="text-xs text-[#736453] leading-relaxed">
          {BRAND.policyNotice}
        </p>
        <p className="text-[11px] text-stone-500 italic pt-1 border-t border-[#E8C99F]/40">
          * Opening WhatsApp opens a direct chat with Rekha Collection (+977 9764688779). Delivery charge and availability will be confirmed before dispatch.
        </p>
      </div>
    </div>
  );
}
