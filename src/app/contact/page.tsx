import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import {
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Rekha Collection Butwal, Nepal",
  description:
    "Get in touch with Rekha Collection in Butwal, Nepal. Direct WhatsApp chat +977 9764688779, TikTok @rekhacollectionbutwal, and phone inquiries.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B88632]/30 text-xs font-serif uppercase tracking-widest text-[#B88632]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Assistance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211A14] tracking-tight">
            Connect with Rekha Collection
          </h1>

          <p className="text-sm sm:text-base text-[#736453]">
            Have a question about a jewellery design, price, sizing, or delivery? Reach out to us directly through WhatsApp or phone.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white p-7 rounded-xl border border-[#B88632]/25 luxury-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#211A14]">
                WhatsApp Ordering
              </h2>
              <p className="text-xs text-[#736453] leading-relaxed">
                Fastest way to order products, verify availability, request video previews, and confirm delivery details.
              </p>
              <div className="text-sm font-semibold text-[#211A14] pt-1">
                {BRAND.phone}
              </div>
            </div>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          {/* TikTok Card */}
          <div className="bg-white p-7 rounded-xl border border-[#B88632]/25 luxury-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-[#211A14] flex items-center justify-center">
                <svg className="w-6 h-6 fill-current text-[#211A14]" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#211A14]">
                TikTok Profile
              </h2>
              <p className="text-xs text-[#736453] leading-relaxed">
                Watch our latest video reels, close-up sparkle demonstrations, and new catalogue arrivals on TikTok.
              </p>
              <div className="text-sm font-semibold text-[#211A14] pt-1">
                {BRAND.tiktokHandle}
              </div>
            </div>

            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#211A14] hover:bg-[#3D3228] text-white py-3 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors shadow"
            >
              <span>Follow on TikTok</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E8C99F]" />
            </a>
          </div>

          {/* Telephone / Direct Voice Call */}
          <div className="bg-white p-7 rounded-xl border border-[#B88632]/25 luxury-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E8C99F]/20 text-[#B88632] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#211A14]">
                Telephone Line
              </h2>
              <p className="text-xs text-[#736453] leading-relaxed">
                Direct phone inquiries for general questions, order tracking, and urgent customer assistance.
              </p>
              <div className="text-sm font-semibold text-[#211A14] pt-1">
                {BRAND.phone}
              </div>
            </div>

            <a
              href={BRAND.callUrl}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF6EE] text-[#211A14] py-3 rounded-md text-xs uppercase tracking-wider font-semibold border border-stone-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B88632]" />
              <span>Call Us Now</span>
            </a>
          </div>
        </div>

        {/* Location Notice (Honoring Instruction: No fake street or map pin) */}
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-[#B88632]/25 luxury-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B88632]/30 flex items-center justify-center text-[#B88632]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#211A14]">
                  Physical Location
                </h2>
                <div className="text-sm font-medium text-[#B88632]">
                  {BRAND.location}
                </div>
              </div>
            </div>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#211A14] text-white px-5 py-2.5 rounded-md text-xs uppercase tracking-wider font-medium hover:bg-[#3D3228] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Request Showroom Directions</span>
            </a>
          </div>

          <div className="pt-6 space-y-3 text-xs text-[#736453] leading-relaxed">
            <p>
              Rekha Collection is operating out of <strong>Butwal, Nepal</strong>. To arrange a showroom appointment or verify in-person visits, please send a message to our WhatsApp helpline (+977 9764688779) where our staff will gladly coordinate the exact location details.
            </p>
            <p className="text-[11px] text-stone-500 italic">
              * Note: We deliver throughout all districts in Nepal via Cash on Delivery. In-store visits are accommodated by prior appointment.
            </p>
          </div>
        </div>

        {/* Ordering Policy Reminder */}
        <div className="bg-[#FAF6EE] border border-[#B88632]/30 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#211A14] space-y-1 text-center sm:text-left">
            <div className="font-bold flex items-center justify-center sm:justify-start gap-2">
              <Truck className="w-4 h-4 text-[#B88632]" />
              <span>{BRAND.codNotice}</span>
            </div>
            <div className="text-[#736453]">
              {BRAND.policyNotice}
            </div>
          </div>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#211A14] text-white px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold"
          >
            WhatsApp Helpline
          </a>
        </div>
      </div>
    </div>
  );
}
