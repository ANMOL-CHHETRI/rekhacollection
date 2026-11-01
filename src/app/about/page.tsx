import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Sparkles, MapPin, MessageCircle, Truck, RotateCcw, Heart, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "About Rekha Collection | Jewellery Business in Butwal, Nepal",
  description:
    "Learn about Rekha Collection, a premier jewellery business located in Butwal, Nepal. Elegance in every sparkle, nationwide cash on delivery, and dedicated WhatsApp support.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header / Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B88632]/30 text-xs font-serif uppercase tracking-widest text-[#B88632]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211A14] tracking-tight">
            About Rekha Collection
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-[#B88632]">
            &ldquo;{BRAND.tagline}&rdquo;
          </p>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-12 rounded-xl border border-[#B88632]/25 luxury-shadow">
          <div className="space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211A14]">
              Jewellery Curated in Butwal, Nepal
            </h2>

            <p className="text-sm text-[#736453] leading-relaxed">
              Based in the vibrant city of Butwal, Nepal, <strong>Rekha Collection</strong> was established to bring an exquisite assortment of jewellery to adorn women for weddings, special celebrations, and meaningful daily moments.
            </p>

            <p className="text-sm text-[#736453] leading-relaxed">
              We take pride in presenting jewellery designs that resonate with timeless cultural aesthetics while offering modern charm. From bridal chokers and ornate jhumkas to delicate bangles and statement rings, our catalogue offers thoughtful options for every occasion.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#211A14]">
              <MapPin className="w-4 h-4 text-[#B88632]" />
              <span>Proudly rooted in Butwal, Rupandehi, Nepal</span>
            </div>
          </div>

          {/* Authentic Logo Showcase */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#FAF6EE] rounded-lg border border-[#E8C99F]/60 text-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-lg p-2 border border-[#B88632]/40 luxury-shadow mb-4">
              <Image
                src={BRAND.logo}
                alt="Rekha Collection Official Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="font-serif text-lg font-bold text-[#211A14] uppercase tracking-wider">
              {BRAND.name}
            </div>
            <div className="text-xs text-[#B88632] italic font-serif">
              {BRAND.tagline}
            </div>
          </div>
        </div>

        {/* Brand Principles / Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#B88632]/20 luxury-shadow space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#B88632] flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#211A14]">
              Curated Designs
            </h3>
            <p className="text-xs text-[#736453] leading-relaxed">
              Carefully chosen jewellery selections suited for bridal festivities, festivals like Teej and Dashain, and elegant everyday wear.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#B88632]/20 luxury-shadow space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#B88632] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#211A14]">
              Nepal-Wide Delivery
            </h3>
            <p className="text-xs text-[#736453] leading-relaxed">
              Cash on delivery is available throughout Nepal, making it simple to order from any district with payment collected upon handover.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#B88632]/20 luxury-shadow space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#B88632] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#211A14]">
              Personalized Assistance
            </h3>
            <p className="text-xs text-[#736453] leading-relaxed">
              Order directly via WhatsApp where our team assists with product inquiries, close-up photos, and order status updates.
            </p>
          </div>
        </div>

        {/* Store Policy Callout */}
        <div className="bg-[#FAF6EE] border border-[#B88632]/40 rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#8F641B]">
            <RotateCcw className="w-4 h-4" />
            <span>Store Policy Reminder</span>
          </div>
          <p className="text-sm text-[#211A14] font-medium leading-relaxed">
            &ldquo;{BRAND.policyNotice}&rdquo;
          </p>
          <div className="pt-2">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 bg-[#211A14] text-[#FAF6EE] px-6 py-3 rounded-md text-xs uppercase tracking-widest font-semibold hover:bg-[#3D3228] transition-colors"
            >
              <span>Explore The Collection</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
