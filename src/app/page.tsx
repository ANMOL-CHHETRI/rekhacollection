import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/db";
import { BRAND } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import {
  Sparkles,
  Truck,
  RotateCcw,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Gem,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const hasDemoProducts = featuredProducts.some((p) => p.is_demo);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Refined Luxury Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#FAF6EE] border-b border-[#E8C99F]/50">
        {/* Ambient Warm Golden Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/80 to-[#FAF6EE] z-10" />

        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/images/hero-editorial.jpg"
            alt="Rekha Collection Jewellery Editorial"
            fill
            priority
            className="object-cover object-center filter saturate-75"
          />
        </div>

        {/* Decorative Gold Rings & Ornaments */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E8C99F]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#B88632]/10 blur-3xl pointer-events-none" />

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
          {/* Subtle Tagline / Location Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#B88632]/30 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom duration-500">
            <Sparkles className="w-3.5 h-3.5 text-[#B88632]" />
            <span className="text-xs uppercase tracking-widest font-medium text-[#211A14]">
              {BRAND.location} • Fine Jewellery Catalogue
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#211A14] leading-[1.15] mb-6">
            Elegance in <span className="gold-gradient-text italic font-normal">Every Sparkle</span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl text-base sm:text-lg text-[#736453] leading-relaxed mb-8 font-light">
            Welcome to <span className="font-semibold text-[#211A14]">Rekha Collection</span>, your premier jewellery destination based in Butwal, Nepal. Explore our curated selection of bridal sets, traditional jhumkas, engraved bangles, and sparkling diamond pieces designed to celebrate life&apos;s most precious moments.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/collection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#211A14] hover:bg-[#3D3228] text-[#FAF6EE] px-8 py-4 rounded-md font-serif text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-xl border border-[#B88632]/50 group"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 text-[#E8C99F] group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF6EE] text-[#211A14] px-7 py-4 rounded-md text-sm uppercase tracking-wider font-semibold transition-all duration-200 border border-[#B88632]/40 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>

          {/* Highlights Row */}
          <div className="mt-14 pt-8 border-t border-[#B88632]/20 grid grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-3xl w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8C99F]/30 flex items-center justify-center text-[#B88632] shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#211A14]">Cash on Delivery</div>
                <div className="text-[11px] text-[#736453]">Available all over Nepal</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8C99F]/30 flex items-center justify-center text-[#B88632] shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#211A14]">Clear Policy</div>
                <div className="text-[11px] text-[#736453]">No returns or exchanges</div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-center gap-3 justify-center md:justify-start">
              <div className="w-9 h-9 rounded-full bg-[#E8C99F]/30 flex items-center justify-center text-[#B88632] shrink-0">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#211A14]">Order on WhatsApp</div>
                <div className="text-[11px] text-[#736453]">+977 9764688779</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Introduction Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8C99F]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Brand Composition */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden border border-[#B88632]/30 luxury-shadow p-2 bg-[#FAF6EE]">
                <div className="relative w-full h-full rounded overflow-hidden">
                  <Image
                    src="/images/necklace.jpg"
                    alt="Handcrafted Bridal Necklace - Rekha Collection"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Medallion Badge */}
              <div className="absolute -bottom-6 -right-4 sm:bottom-4 sm:-right-6 bg-[#211A14] text-[#FAF6EE] p-5 rounded-lg border border-[#B88632] shadow-xl max-w-[220px]">
                <div className="flex items-center gap-2 mb-1">
                  <Gem className="w-4 h-4 text-[#E8C99F]" />
                  <span className="text-xs font-serif uppercase tracking-wider text-[#E8C99F] font-semibold">
                    Rekha Collection
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Based in Butwal, Nepal with nationwide cash-on-delivery service.
                </p>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B88632]">
                <span className="w-6 h-[1px] bg-[#B88632]" />
                <span>Our Heritage & Vision</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A14] leading-tight">
                Designed for Life&apos;s Cherished Celebrations
              </h2>

              <p className="text-sm sm:text-base text-[#736453] leading-relaxed">
                Rekha Collection is dedicated to providing customers across Nepal with captivating jewellery designs that combine classic traditions and contemporary aesthetics. Whether preparing for a wedding, family festival, or everyday refinement, each piece is selected to highlight your individuality.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B88632] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#211A14]">
                    <strong>Curated Selection:</strong> Exquisite bridal choker sets, jhumkas, kada bangles, and statement rings.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B88632] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#211A14]">
                    <strong>Nationwide Delivery:</strong> Convenient cash on delivery dispatched to major towns and cities throughout Nepal.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B88632] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#211A14]">
                    <strong>Direct Personal Assistance:</strong> Speak directly with our team on WhatsApp for availability and sizing inquiries.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/about"
                  className="text-xs uppercase tracking-wider font-semibold text-[#211A14] hover:text-[#B88632] transition-colors underline underline-offset-4"
                >
                  Learn More About Us →
                </Link>
                <Link
                  href="/collection"
                  className="text-xs uppercase tracking-wider font-semibold text-[#B88632] hover:text-[#211A14] transition-colors"
                >
                  Explore All Categories →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B88632] block mb-2">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A14] mb-4">
              Featured Jewellery Collection
            </h2>
            <p className="text-sm sm:text-base text-[#736453]">
              Discover our signature pieces. Every item is detailed with exact pricing in NPR and is ready to be ordered directly via WhatsApp.
            </p>

            {/* Demo Products Notice if active */}
            {hasDemoProducts && (
              <div className="mt-4 inline-block bg-[#E8C99F]/30 border border-[#B88632]/40 rounded-full px-4 py-1.5 text-xs text-[#736453]">
                ℹ️ Displaying demonstration samples. Store owner can update inventory anytime in the Admin Dashboard.
              </div>
            )}
          </div>

          {/* Product Grid: 4 columns desktop, 2 columns mobile */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E8C99F] p-12 text-center max-w-lg mx-auto">
              <p className="text-sm text-[#736453] mb-4">
                Our collection is being updated. Contact us on WhatsApp for assistance and current in-store inventory.
              </p>
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#211A14] text-white px-5 py-2.5 rounded text-xs uppercase tracking-wider font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 bg-[#211A14] hover:bg-[#3D3228] text-white px-8 py-3.5 rounded-md font-serif text-xs uppercase tracking-widest font-semibold transition-all duration-200 border border-[#B88632]/40 shadow hover:shadow-lg"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8C99F]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mandatory Policy & Trust Section */}
      <section className="py-14 bg-[#E8C99F]/20 border-t border-b border-[#B88632]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#B88632]/40 text-[#B88632] shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#211A14]">
            Transparent Shopping Experience
          </h3>

          <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#B88632]/30 luxury-shadow max-w-3xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pb-4 border-b border-stone-200 text-sm font-semibold text-[#211A14]">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B88632]" />
                {BRAND.codNotice}
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#B88632]" />
                {BRAND.returnNotice}
              </span>
            </div>

            <p className="text-sm text-[#736453] leading-relaxed">
              &ldquo;{BRAND.policyNotice}&rdquo;
            </p>

            <p className="text-xs text-stone-500 italic">
              Delivery charges and estimated arrival timelines will be verified and communicated directly by Rekha Collection on WhatsApp before your parcel is dispatched.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
