"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF6EE]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl border border-[#B88632]/30 luxury-shadow relative">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#736453] hover:text-[#211A14] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rekha Collection</span>
        </Link>

        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="relative h-16 w-16 mx-auto rounded-lg overflow-hidden border border-[#B88632]/40 p-1 bg-white shadow-sm">
            <Image
              src={BRAND.logo}
              alt="Rekha Collection"
              width={70}
              height={70}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#211A14]">
            Admin Control Center
          </h1>
          <p className="text-xs text-[#736453]">
            Protected portal for catalogue management and inventory updates
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#211A14] mb-1.5">
              Admin Login ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-200 bg-[#FAF6EE]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/40 text-sm text-[#211A14]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#211A14] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-md border border-stone-200 bg-[#FAF6EE]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/40 text-sm text-[#211A14]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#211A14] hover:bg-[#3D3228] disabled:opacity-50 text-[#FAF6EE] py-3 rounded-md text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow border border-[#B88632]"
          >
            <ShieldCheck className="w-4 h-4 text-[#E8C99F]" />
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-stone-500">
          🔒 Secure server-validated admin authentication with rate-limit protection.
        </div>
      </div>
    </div>
  );
}
