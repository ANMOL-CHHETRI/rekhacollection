import React from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/db";
import CatalogueView from "@/components/CatalogueView";
import { BRAND } from "@/lib/constants";
import { Sparkles, Truck, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jewellery Collection | Rekha Collection Butwal",
  description:
    "Explore our complete jewellery catalogue. Bridal sets, gold jhumkas, kada bangles, and diamond rings. Cash on delivery available all over Nepal. Order on WhatsApp.",
};

export default function CollectionPage() {
  const products = getAllProducts(false);

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#B88632]/30 text-xs font-serif uppercase tracking-widest text-[#B88632] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211A14] tracking-tight mb-4">
            Our Jewellery Collection
          </h1>

          <p className="text-sm sm:text-base text-[#736453] leading-relaxed">
            Browse our handcrafted jewellery pieces. Click on any item to view details, prices, and order directly through WhatsApp with cash on delivery throughout Nepal.
          </p>

          {/* Quick Policy Reminders */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#211A14] bg-white/70 backdrop-blur-sm py-2.5 px-6 rounded-full border border-[#B88632]/20 inline-flex">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#B88632]" />
              {BRAND.codNotice}
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <RotateCcw className="w-3.5 h-3.5 text-[#B88632]" />
              {BRAND.returnNotice}
            </span>
          </div>
        </div>

        {/* Live Catalogue View */}
        <CatalogueView initialProducts={products} />
      </div>
    </div>
  );
}
