"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { Menu, X, Phone, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If in admin dashboard, we can keep the header minimal or let admin have its own topbar
  const isAdminRoute = pathname?.startsWith("/admin");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#E8C99F]/50 shadow-sm transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#211A14] text-[#FAF6EE] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8C99F] animate-pulse" />
            <span className="font-medium tracking-wide">
              {BRAND.codNotice}
            </span>
            <span className="hidden md:inline text-[#E8C99F]/70">•</span>
            <span className="hidden md:inline text-stone-300">
              {BRAND.returnNotice}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#E8C99F]">
            <span className="flex items-center gap-1 text-stone-300">
              📍 {BRAND.location}
            </span>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              {BRAND.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - exact artwork, never cropped, stretched or recoloured */}
          <Link href="/" className="flex items-center gap-3 group py-2">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-md border border-[#B88632]/25 shadow-sm bg-white p-0.5 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={BRAND.logo}
                alt="Rekha Collection - Elegance in every sparkle"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#211A14] uppercase">
                Rekha Collection
              </span>
              <span className="text-[11px] sm:text-xs italic text-[#B88632] tracking-widest font-serif">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase font-medium transition-colors relative py-1 ${
                    isActive
                      ? "text-[#B88632] font-semibold"
                      : "text-[#211A14] hover:text-[#B88632]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B88632] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#211A14] hover:bg-[#3D3228] text-[#FAF6EE] px-4 py-2.5 rounded-sm text-xs font-medium uppercase tracking-wider transition-all duration-200 border border-[#B88632]/30 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Inquiry</span>
            </a>

            {isAdminRoute ? (
              <Link
                href="/admin"
                className="text-xs px-3 py-1.5 rounded border border-[#B88632] text-[#B88632] font-medium hover:bg-[#B88632] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/admin/login"
                title="Admin Portal"
                className="text-stone-400 hover:text-[#211A14] p-1.5 transition-colors text-xs flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="sr-only">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#211A14] bg-[#E8C99F]/40 rounded-full"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#211A14] hover:bg-[#E8C99F]/30 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-[#E8C99F] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded text-sm uppercase tracking-wider font-medium ${
                    isActive
                      ? "bg-[#E8C99F]/40 text-[#B88632] font-semibold"
                      : "text-[#211A14] hover:bg-[#E8C99F]/20"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs text-stone-500 uppercase tracking-wider"
            >
              Admin Portal
            </Link>
          </div>

          <div className="pt-2 border-t border-[#E8C99F]/50 flex flex-col gap-2.5">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#211A14] text-[#FAF6EE] py-3 rounded text-xs font-semibold uppercase tracking-wider shadow"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat on WhatsApp (+977 9764688779)</span>
            </a>
            <div className="text-center text-[11px] text-[#736453]">
              📍 Based in {BRAND.location} • Cash on Delivery throughout Nepal
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
