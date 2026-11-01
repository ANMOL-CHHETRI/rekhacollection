import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { MessageCircle, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#211A14] text-[#FAF6EE] pt-16 pb-12 border-t border-[#B88632]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-stone-800">
          {/* Brand Info & Exact Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-[#B88632]/40 bg-white p-0.5">
                <Image
                  src={BRAND.logo}
                  alt="Rekha Collection"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wider uppercase text-white">
                  {BRAND.name}
                </h3>
                <p className="text-xs italic text-[#E8C99F] font-serif">
                  {BRAND.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Curated fine jewellery catalogue from Butwal, Nepal. Delivering grace, craftsmanship, and timeless elegance to your doorstep across Nepal.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#E8C99F]">
              <MapPin className="w-4 h-4 shrink-0 text-[#B88632]" />
              <span>{BRAND.location}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#E8C99F] mb-4 border-b border-[#B88632]/20 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/" className="hover:text-[#E8C99F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-[#E8C99F] transition-colors">
                  Jewellery Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E8C99F] transition-colors">
                  About Rekha Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E8C99F] transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#E8C99F] transition-colors flex items-center gap-1 text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Policies */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#E8C99F] mb-4 border-b border-[#B88632]/20 pb-2">
              Ordering & Policies
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#E8C99F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Cash on Delivery</span>
                  <span className="text-stone-400">Available all over Nepal. Payment upon delivery.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#E8C99F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Return Policy</span>
                  <span className="text-stone-400">{BRAND.returnNotice}. Please inspect details prior to dispatch.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#E8C99F] mb-4 border-b border-[#B88632]/20 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-stone-900/90 border border-stone-800 hover:border-[#25D366] p-3 rounded text-stone-200 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">WhatsApp Order</div>
                  <div className="font-semibold text-white">{BRAND.phone}</div>
                </div>
              </a>

              <a
                href={BRAND.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-stone-900/90 border border-stone-800 hover:border-[#E8C99F] p-3 rounded text-stone-200 transition-colors group"
              >
                <svg
                  className="w-4 h-4 fill-current text-[#E8C99F] group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">TikTok Channel</div>
                  <div className="font-semibold text-white">{BRAND.tiktokHandle}</div>
                </div>
              </a>

              <a
                href={BRAND.callUrl}
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors pt-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#B88632]" />
                <span>Call Us: {BRAND.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            <span>{BRAND.policyNotice}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
