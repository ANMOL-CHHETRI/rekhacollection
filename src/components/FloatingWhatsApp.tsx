"use client";

import React from "react";
import { BRAND } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Direct WhatsApp Assistance"
      className="fixed bottom-4 right-4 z-30"
    >
      <a
        href={BRAND.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Rekha Collection on WhatsApp"
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] hover:bg-[#20BA59] text-white rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </aside>
  );
}
