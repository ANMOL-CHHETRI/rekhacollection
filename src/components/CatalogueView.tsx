"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/lib/db";
import { BRAND } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, MessageCircle, AlertCircle, Sparkles } from "lucide-react";

interface CatalogueViewProps {
  initialProducts: Product[];
}

export default function CatalogueView({ initialProducts }: CatalogueViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "sold_out">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search filter (name or reference)
        const matchesSearch =
          searchQuery.trim() === "" ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.reference.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;

        // Availability filter
        const matchesAvailability =
          availabilityFilter === "all" || product.availability === availabilityFilter;

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return a.price - b.price;
        } else if (sortBy === "price_desc") {
          return b.price - a.price;
        } else {
          // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [initialProducts, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const hasDemoProducts = initialProducts.some((p) => p.is_demo);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setAvailabilityFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Toolbar */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#B88632]/20 luxury-shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by jewellery name or reference (e.g. RC-101)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-md border border-stone-200 bg-[#FAF6EE]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/40 text-sm text-[#211A14]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability & Sorting Dropdowns */}
          <div className="flex items-center gap-2.5">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="px-3 py-2.5 rounded-md border border-stone-200 bg-[#FAF6EE]/50 text-xs font-medium text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
              aria-label="Filter availability"
            >
              <option value="all">All Availability</option>
              <option value="available">In Stock Only</option>
              <option value="sold_out">Sold Out</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-md border border-stone-200 bg-[#FAF6EE]/50 text-xs font-medium text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
              aria-label="Sort products"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {BRAND.categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-[#211A14] text-[#FAF6EE] shadow-sm border border-[#B88632]"
                    : "bg-[#FAF6EE] hover:bg-[#E8C99F]/40 text-[#211A14] border border-stone-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalogue Meta Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#736453]">
        <div>
          Showing <span className="font-bold text-[#211A14]">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "jewellery item" : "jewellery items"}
          {selectedCategory !== "All" && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {hasDemoProducts && (
          <div className="text-[11px] text-[#8F641B] flex items-center gap-1 bg-[#E8C99F]/20 px-3 py-1 rounded-full border border-[#B88632]/30">
            <Sparkles className="w-3 h-3 text-[#B88632]" />
            <span>Catalogue contains sample demonstration designs</span>
          </div>
        )}
      </div>

      {/* Responsive Product Grid: 4 columns large screens, 2 on mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg border border-[#E8C99F] p-10 sm:p-16 text-center max-w-lg mx-auto luxury-shadow space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B88632]/40 text-[#B88632] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#211A14]">
            No matching jewellery found
          </h3>
          <p className="text-xs text-[#736453] leading-relaxed max-w-sm mx-auto">
            Our collection is constantly being updated. If you are looking for a specific design, choker set, or bridal piece, contact us directly on WhatsApp.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="text-xs uppercase tracking-wider font-semibold text-[#211A14] hover:text-[#B88632] px-4 py-2 rounded border border-stone-300 transition-colors"
            >
              Reset Filters
            </button>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#211A14] text-white px-5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold shadow hover:bg-[#3D3228] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
