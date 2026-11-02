"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { MessageCircle, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#B88632]/25 shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand: Logo & Business Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
        >
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded border border-[#B88632]/30 bg-white p-0.5 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src={BRAND.logo}
              alt="Rekha Collection Logo"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#211A14] leading-tight">
              {BRAND.name}
            </span>
            <span className="text-[10px] text-[#8F641B] tracking-wider uppercase font-medium">
              Butwal, Nepal
            </span>
          </div>
        </Link>

        {/* WhatsApp Icon Button & Admin Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order or enquire on WhatsApp (+977 9764688779)"
            className="inline-flex items-center gap-1.5 bg-[#211A14] hover:bg-[#3D3228] text-[#FAF6EE] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium tracking-wide border border-[#B88632]/40 transition-all shadow-xs hover:shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-current" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* Discreet Admin Portal Link */}
          <Link
            href="/admin"
            title="Admin Portal"
            className="p-1.5 text-stone-400 hover:text-[#211A14] transition-colors rounded"
            aria-label="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
