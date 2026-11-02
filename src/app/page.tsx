import React from "react";
import { getAllProducts } from "@/lib/db";
import JewelleryMenu from "@/components/JewelleryMenu";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = getAllProducts(false);

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 max-w-5xl mx-auto">
      {/* Small Attractive Title */}
      <div className="text-center mb-4 sm:mb-6 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#211A14]">
          Find Your Sparkle
        </h1>
        <p className="text-xs text-[#736453] max-w-sm mx-auto">
          Handcrafted jewellery catalogue • Tap any piece to order on WhatsApp
        </p>
      </div>

      {/* Instant Jewellery Menu: Search + Filters + Product Grid + Modal */}
      <JewelleryMenu initialProducts={products} />
    </div>
  );
}
