import React from "react";
import { BRAND } from "@/lib/constants";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAF6EE] border-t border-[#B88632]/20 pt-8 pb-10 text-[#211A14]">
      <div className="max-w-xl mx-auto px-4 text-center space-y-4">
        {/* Brand Title & Location */}
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#211A14] uppercase">
            {BRAND.name}
          </h2>
          <p className="text-xs text-[#736453] mt-0.5 font-medium">
            {BRAND.location}
          </p>
        </div>

        {/* Direct Contact Buttons (WhatsApp & TikTok) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs pt-1">
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Rekha Collection on WhatsApp"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#211A14] px-4 py-2 rounded-lg border border-[#B88632]/30 shadow-2xs hover:border-[#B88632] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-current shrink-0" />
            <span className="font-medium">WhatsApp: {BRAND.phone}</span>
          </a>

          <a
            href={BRAND.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Rekha Collection on TikTok"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#211A14] px-4 py-2 rounded-lg border border-[#B88632]/30 shadow-2xs hover:border-[#B88632] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-[#211A14] shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span className="font-medium">TikTok: {BRAND.tiktokHandle}</span>
          </a>
        </div>

        {/* Delivery & Return Notice Box */}
        <div className="bg-white/90 border border-[#B88632]/25 rounded-lg py-2.5 px-4 text-xs text-[#736453] leading-relaxed max-w-md mx-auto shadow-2xs">
          <span className="font-semibold text-[#211A14]">Note:</span> {BRAND.notice}
        </div>

        {/* Bottom Row: Copyright & Admin Portal */}
        <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600 max-w-md mx-auto">
          <span>© {new Date().getFullYear()} {BRAND.name}</span>
          <Link
            href="/admin"
            className="hover:text-[#211A14] transition-colors inline-flex items-center gap-1 text-stone-600 hover:underline"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B88632]" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
