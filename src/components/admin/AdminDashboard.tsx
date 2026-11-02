"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/db";
import { BRAND, formatNpr } from "@/lib/constants";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Key,
} from "lucide-react";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialStats: {
    total: number;
    available: number;
    soldOut: number;
    hidden: number;
  };
  adminUsername: string;
}

const CATEGORY_OPTIONS = ["Necklaces", "Earrings", "Rings", "Bracelets", "Other"];

export default function AdminDashboard({
  initialProducts,
  adminUsername,
}: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields (Exactly 6 fields + auto-generated reference)
  const [formRef, setFormRef] = useState("");
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Necklaces");
  const [formAvailability, setFormAvailability] = useState<"available" | "sold_out">("available");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("/images/necklace.jpg");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Generate next unique reference (e.g. RC-107, RC-108...)
  const generateUniqueReference = () => {
    const existingRefs = new Set(products.map((p) => p.reference.toUpperCase()));
    let nextNum = 101;
    while (existingRefs.has(`RC-${nextNum}`)) {
      nextNum++;
    }
    return `RC-${nextNum}`;
  };

  // Open modal to add product
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormRef(generateUniqueReference());
    setFormName("");
    setFormPrice("");
    setFormCategory("Necklaces");
    setFormAvailability("available");
    setFormDescription("");
    setFormImage("/images/necklace.jpg");
    setFormError("");
    setIsFormModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormRef(product.reference);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormCategory(product.category || "Necklaces");
    setFormAvailability(product.availability === "sold_out" ? "sold_out" : "available");
    setFormDescription(product.description || "");
    setFormImage(product.images?.[0] || "/images/necklace.jpg");
    setFormError("");
    setIsFormModalOpen(true);
  };

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to upload image.");
        setUploadingImage(false);
        return;
      }

      setFormImage(data.url);
      setUploadingImage(false);
    } catch {
      setFormError("Network error while uploading image.");
      setUploadingImage(false);
    }
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Please enter a product name.");
      return;
    }

    const priceNum = Number(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter a valid price in NPR.");
      return;
    }

    setSubmitting(true);

    const payload = {
      reference: formRef.trim(),
      name: formName.trim(),
      price: priceNum,
      category: formCategory.trim() || "Other",
      availability: formAvailability,
      description: formDescription.trim(),
      images: [formImage],
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to save product.");
        setSubmitting(false);
        return;
      }

      if (isEditing) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? data.product : p))
        );
        showToast(`"${payload.name}" updated successfully!`);
      } else {
        setProducts((prev) => [data.product, ...prev]);
        showToast(`"${payload.name}" added to catalogue!`);
      }

      setSubmitting(false);
      setIsFormModalOpen(false);
      router.refresh();
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  // Toggle Hide / Show Product
  const handleToggleHide = async (product: Product) => {
    const newStatus = product.availability === "hidden" ? "available" : "hidden";

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update visibility.", "error");
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? data.product : p))
      );
      showToast(
        newStatus === "hidden"
          ? `"${product.name}" is now hidden from public view.`
          : `"${product.name}" is now visible to customers.`
      );
      router.refresh();
    } catch {
      showToast("Network error while updating visibility.", "error");
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to delete product.", "error");
        setDeleting(false);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`"${productToDelete.name}" deleted permanently.`);
      setProductToDelete(null);
      setDeleting(false);
      router.refresh();
    } catch {
      showToast("Network error while deleting product.", "error");
      setDeleting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setUpdatingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password.");
        setUpdatingPassword(false);
        return;
      }

      setPasswordSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setUpdatingPassword(false);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1500);
    } catch {
      setPasswordError("Network error. Please try again.");
      setUpdatingPassword(false);
    }
  };

  // Filtered Products for admin list
  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-white rounded-xl border border-[#B88632]/25 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded border border-[#B88632]/30 p-0.5 bg-white shrink-0">
            <Image
              src={BRAND.logo}
              alt="Rekha Collection"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#211A14]">
              Rekha Collection Admin
            </h1>
            <p className="text-xs text-[#736453]">
              Manage products, pricing, and availability
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-[#736453] hover:text-[#211A14] bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded transition-colors"
          >
            <span>View Catalogue</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-[#736453] hover:text-[#211A14] bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded transition-colors"
            title="Change Admin Password"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Action Bar: Search & Add Product Button */}
      <div className="bg-white rounded-xl border border-[#B88632]/25 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or reference..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-stone-200 bg-[#FAF6EE]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/40 text-xs sm:text-sm text-[#211A14]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#211A14] hover:bg-[#3D3228] text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E8C99F]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Simple Product List */}
      <div className="bg-white rounded-xl border border-[#B88632]/25 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-stone-100 bg-[#FAF6EE] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#211A14] uppercase tracking-wider">
            All Products ({filteredProducts.length})
          </span>
          <span className="text-[11px] text-[#736453]">
            Logged in as <strong>{adminUsername}</strong>
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {filteredProducts.map((product) => {
              const isHidden = product.availability === "hidden";
              const isSoldOut = product.availability === "sold_out";

              return (
                <div
                  key={product.id}
                  className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors ${
                    isHidden ? "opacity-60 bg-stone-50/50" : ""
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-stone-200 bg-[#FAF6EE] shrink-0">
                      <Image
                        src={product.images?.[0] || "/images/necklace.jpg"}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold text-[#736453] bg-stone-100 px-1.5 py-0.5 rounded">
                          {product.reference}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {product.category}
                        </span>
                        {/* Status Badge */}
                        {isHidden ? (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                            Hidden
                          </span>
                        ) : isSoldOut ? (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Sold Out
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-sm font-semibold text-[#211A14] truncate mt-0.5">
                        {product.name}
                      </h3>

                      <div className="text-xs font-bold text-[#B88632] mt-0.5">
                        {formatNpr(product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Edit, Hide/Show, Delete) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Hide / Show Toggle */}
                    <button
                      onClick={() => handleToggleHide(product)}
                      title={isHidden ? "Unhide product" : "Hide product from catalogue"}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border transition-colors ${
                        isHidden
                          ? "bg-stone-100 text-[#211A14] border-stone-300 hover:bg-stone-200"
                          : "bg-white text-stone-600 border-stone-200 hover:text-[#211A14] hover:bg-stone-50"
                      }`}
                    >
                      {isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Show</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(product)}
                      title="Edit Product"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border border-stone-200 bg-white text-[#211A14] hover:bg-stone-50 hover:border-[#B88632]/50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#B88632]" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setProductToDelete(product)}
                      title="Delete Product"
                      className="inline-flex items-center justify-center p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#736453]">
            No products found. Tap &quot;Add Product&quot; to create your first jewellery item.
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal - Exactly 6 fields */}
      {isFormModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#B88632]/30 w-full max-w-lg overflow-hidden shadow-xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Title */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-[#FAF6EE]">
              <h2 className="font-serif text-base font-bold text-[#211A14]">
                {isEditing ? `Edit Product (${formRef})` : "Add New Jewellery"}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-[#211A14] hover:bg-stone-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProduct} className="overflow-y-auto p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Product Photo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  1. Product Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-stone-300 bg-[#FAF6EE] shrink-0">
                    <Image
                      src={formImage}
                      alt="Product preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-[#211A14] px-3 py-2 rounded text-xs font-medium cursor-pointer transition-colors border border-stone-300">
                      <Upload className="w-3.5 h-3.5 text-[#B88632]" />
                      <span>{uploadingImage ? "Uploading..." : "Upload New Photo"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Supports JPG, PNG, WEBP. Photo is saved securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  2. Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Traditional Gold Jhumkas"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
                />
              </div>

              {/* 3. Price in NPR */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  3. Price in NPR *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#736453]">
                    NPR
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 48000"
                    className="w-full pl-12 pr-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40 font-mono"
                  />
                </div>
              </div>

              {/* 4. Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  4. Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-[#211A14] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Availability */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  5. Availability *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormAvailability("available")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      formAvailability === "available"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-400 ring-1 ring-emerald-400"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    ✓ Available (In Stock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormAvailability("sold_out")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      formAvailability === "sold_out"
                        ? "bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-400"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    ✗ Sold Out
                  </button>
                </div>
              </div>

              {/* 6. Optional Short Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211A14] mb-1.5">
                  6. Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Fine craftsmanship with pearl drops. Suitable for bridal and festive occasions."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
                />
              </div>

              {/* Unique Reference Preview */}
              <div className="text-[11px] text-[#736453] bg-stone-50 p-2 rounded border border-stone-200 flex items-center justify-between">
                <span>Unique Product Reference:</span>
                <span className="font-mono font-bold text-[#211A14]">{formRef}</span>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#211A14] hover:bg-[#3D3228] disabled:opacity-50 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-red-200 w-full max-w-sm p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-base font-bold text-[#211A14]">
                Confirm Deletion
              </h3>
              <p className="text-xs text-[#736453]">
                Are you sure you want to delete{" "}
                <strong>&quot;{productToDelete.name}&quot;</strong> (Ref:{" "}
                {productToDelete.reference})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="w-1/2 py-2 rounded-lg text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-1/2 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#B88632]/30 w-full max-w-sm p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-base font-bold text-[#211A14] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B88632]" />
                <span>Change Password</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#211A14] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#211A14] mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 rounded text-xs text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-4 py-1.5 bg-[#211A14] text-white rounded text-xs font-semibold hover:bg-[#3D3228] disabled:opacity-50"
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
