"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/images/necklace.jpg"];
  const [selectedImage, setSelectedImage] = useState(safeImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Square Image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-[#B88632]/30 luxury-shadow group">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails (if multiple images) */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {safeImages.map((img, idx) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-md overflow-hidden bg-white border-2 transition-all shrink-0 ${
                  isSelected
                    ? "border-[#B88632] ring-2 ring-[#B88632]/30 scale-105"
                    : "border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
