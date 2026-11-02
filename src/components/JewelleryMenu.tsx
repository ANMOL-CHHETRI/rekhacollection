"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/lib/db";
import { BRAND, buildGeneralWhatsAppUrl } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Search, X, MessageCircle } from "lucide-react";

interface JewelleryMenuProps {
  initialProducts: Product[];
}

export default function JewelleryMenu({ initialProducts }: JewelleryMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Compute available categories from actual product data, hiding empty categories
  const categories = useMemo(() => {
    const presentCategories = new Set(initialProducts.map((p) => p.category));
    const ordered: string[] = ["All"];

    // Standard categories in preferred order
    const standards = ["Earrings", "Necklaces", "Rings", "Bracelets", "Other"];
    for (const cat of standards) {
      if (presentCategories.has(cat)) {
        ordered.push(cat);
      }
    }

    // Any other custom category created by admin
    for (const cat of presentCategories) {
      if (!ordered.includes(cat)) {
        ordered.push(cat);
      }
    }

    return ordered;
  }, [initialProducts]);

  // Real-time instant filtering
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialProducts.filter((product) => {
      // Category match
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      if (!matchesCategory) return false;

      // Search match (name or reference)
      if (query === "") return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.reference.toLowerCase().includes(query)
      );
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const whatsappInquiryUrl = buildGeneralWhatsAppUrl(
    searchQuery
      ? `Hello Rekha Collection! I am searching for "${searchQuery}" in your jewellery menu. Do you have this or similar designs available?`
      : undefined
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search Bar - directly above catalogue */}
      <div className="relative w-full max-w-xl mx-auto">
        <label htmlFor="jewellery-search" className="sr-only">
          Search jewellery
        </label>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-stone-600 pointer-events-none" />
          <input
            id="jewellery-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jewellery, ring, necklace, RC-101..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-[#B88632]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/50 text-xs sm:text-sm text-[#211A14] placeholder-stone-600 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 p-0.5 text-stone-600 hover:text-[#211A14]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontally scrollable compact category filters */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 justify-start sm:justify-center scrollbar-none">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 active:scale-95 ${
                isActive
                  ? "bg-[#211A14] text-[#FAF6EE] shadow-2xs border border-[#B88632]"
                  : "bg-white text-[#211A14] border border-[#B88632]/20 hover:border-[#B88632]/60 hover:bg-[#FAF6EE]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Catalogue Item Count - minimal */}
      <div className="text-[11px] text-[#736453] text-center">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "design" : "designs"}
        {selectedCategory !== "All" && ` in ${selectedCategory}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Mobile-first Product Grid: 2 columns on mobile, 3-4 on larger screens */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setActiveProduct}
            />
          ))}
        </div>
      ) : (
        /* Short Empty State with WhatsApp contact option */
        <div className="bg-white rounded-lg border border-[#B88632]/25 p-8 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm font-serif font-semibold text-[#211A14]">
            No jewellery found matching your search
          </p>
          <p className="text-xs text-[#736453]">
            Can&apos;t find what you&apos;re looking for? Contact us directly on WhatsApp for custom designs or inventory inquiries.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto text-xs font-medium text-[#211A14] bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded transition-colors"
            >
              View All Jewellery
            </button>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#211A14] hover:bg-[#3D3228] text-white text-xs font-medium px-4 py-2 rounded transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Lightweight Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </div>
  );
}
