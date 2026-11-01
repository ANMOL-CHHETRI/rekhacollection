"use client";

import React from "react";
import { BRAND } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Direct WhatsApp Assistance"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip on hover/desktop */}
      <span className="hidden sm:inline-block bg-[#211A14] text-[#FAF6EE] text-xs py-1.5 px-3 rounded-full shadow-lg border border-[#B88632]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Order on WhatsApp
      </span>

      <a
        href={BRAND.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Rekha Collection on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-2xl border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B88632] border border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
}
