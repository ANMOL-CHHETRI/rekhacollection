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
  Key,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialStats: {
    total: number;
    available: number;
    soldOut: number;
    hidden: number;
    demoCount: number;
  };
  adminUsername: string;
}

export default function AdminDashboard({
  initialProducts,
  initialStats,
  adminUsername,
}: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formRef, setFormRef] = useState("");
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState<string>(BRAND.categories[1]);
  const [formDescription, setFormDescription] = useState("");
  const [formAvailability, setFormAvailability] = useState<"available" | "sold_out" | "hidden">("available");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Reset demo notice
  const [resettingDemo, setResettingDemo] = useState(false);

  // Filtered Products Table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    const matchesStatus =
      statusFilter === "all" || p.availability === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open modal to add product
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormRef(`RC-${Math.floor(100 + Math.random() * 900)}`);
    setFormName("");
    setFormPrice("");
    setFormCategory(BRAND.categories[1]);
    setFormDescription("");
    setFormAvailability("available");
    setFormFeatured(false);
    setFormImages(["/images/necklace.jpg"]);
    setFormError("");
    setFormSuccess("");
    setIsFormModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormRef(product.reference);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormCategory(product.category as any);
    setFormDescription(product.description || "");
    setFormAvailability(product.availability);
    setFormFeatured(product.featured);
    setFormImages(product.images || ["/images/necklace.jpg"]);
    setFormError("");
    setFormSuccess("");
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

      setFormImages((prev) => [data.url, ...prev]);
      setUploadingImage(false);
    } catch {
      setFormError("Network error while uploading image.");
      setUploadingImage(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const priceNum = Number(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter a valid positive price in NPR.");
      return;
    }

    if (!formRef.trim() || !formName.trim()) {
      setFormError("Product reference and name are required.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        reference: formRef.trim(),
        name: formName.trim(),
        price: priceNum,
        images: formImages.length > 0 ? formImages : ["/images/necklace.jpg"],
        category: formCategory,
        description: formDescription.trim(),
        availability: formAvailability,
        featured: formFeatured,
      };

      const url = isEditing && editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
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

      // Refresh list
      await refreshData();
      setFormSuccess(isEditing ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => {
        setIsFormModalOpen(false);
      }, 1000);
    } catch {
      setFormError("Network error while saving product.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete product.");
        setDeleting(false);
        return;
      }

      await refreshData();
      setProductToDelete(null);
    } catch {
      alert("Error deleting product.");
    } finally {
      setDeleting(false);
    }
  };

  // Quick toggle product availability
  const handleQuickStatusToggle = async (product: Product, newStatus: "available" | "sold_out" | "hidden") => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newStatus }),
      });

      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
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
        setPasswordError(data.error || "Failed to update password.");
        setUpdatingPassword(false);
        return;
      }

      setPasswordSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1500);
    } catch {
      setPasswordError("Error connecting to server.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Clear demo products
  const handleClearDemoProducts = async () => {
    if (
      !confirm(
        "Are you sure you want to remove all demonstration sample products? Only your own inventory will remain."
      )
    ) {
      return;
    }

    setResettingDemo(true);
    try {
      const res = await fetch("/api/admin/demo-reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await refreshData();
      } else {
        alert(data.error || "Failed to remove demo products.");
      }
    } catch {
      alert("Error removing demo products.");
    } finally {
      setResettingDemo(false);
    }
  };

  // Refresh server data
  const refreshData = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Profile Bar */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#B88632]/30 luxury-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FAF6EE] border border-[#B88632]/40 p-1 shrink-0">
            <Image
              src={BRAND.logo}
              alt="Rekha Collection"
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#211A14]">
                Rekha Collection Dashboard
              </h1>
              <span className="bg-[#FAF6EE] text-[#B88632] border border-[#B88632]/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                Owner Portal
              </span>
            </div>
            <p className="text-xs text-[#736453]">
              Logged in as <strong className="text-[#211A14]">{adminUsername}</strong> • Butwal, Nepal
            </p>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/collection"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#FAF6EE] hover:bg-[#E8C99F]/30 text-[#211A14] text-xs font-semibold border border-stone-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B88632]" />
            <span>View Live Catalogue</span>
          </Link>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-[#211A14] text-xs font-semibold border border-stone-200 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-[#B88632]" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-[#B88632]/20 luxury-shadow flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
              Total Products
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#211A14] mt-1">
              {stats.total}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#B88632] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Available Products */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 luxury-shadow flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700">
              Available in Stock
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">
              {stats.available}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Sold Out Products */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 luxury-shadow flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
              Sold Out
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-700 mt-1">
              {stats.soldOut}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Hidden Products */}
        <div className="bg-white p-5 rounded-xl border border-amber-200 luxury-shadow flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-700">
              Hidden (Drafts)
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-900 mt-1">
              {stats.hidden}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Demo Products Management Notice (if any demo items exist) */}
      {stats.demoCount > 0 && (
        <div className="bg-[#FAF6EE] border border-[#B88632]/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#B88632] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#211A14]">
                Demonstration Sample Products ({stats.demoCount} items present)
              </div>
              <p className="text-xs text-[#736453]">
                These sample products serve as preview designs. When you are ready, you can clear them in one click or replace them with your actual inventory.
              </p>
            </div>
          </div>
          <button
            onClick={handleClearDemoProducts}
            disabled={resettingDemo}
            className="shrink-0 bg-[#211A14] hover:bg-[#3D3228] text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            {resettingDemo ? "Removing..." : "Clear Demo Items"}
          </button>
        </div>
      )}

      {/* Main Product Management Table Card */}
      <div className="bg-white rounded-xl border border-[#B88632]/25 luxury-shadow overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference or product name..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-stone-200 text-xs text-[#211A14] focus:outline-none focus:ring-2 focus:ring-[#B88632]/40"
            />
          </div>

          {/* Filters & Add Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-stone-200 text-xs font-medium text-[#211A14] focus:outline-none"
            >
              {BRAND.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-stone-200 text-xs font-medium text-[#211A14] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="sold_out">Sold Out</option>
              <option value="hidden">Hidden Only</option>
            </select>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-[#211A14] hover:bg-[#3D3228] text-[#FAF6EE] px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border border-[#B88632] shadow-sm ml-auto sm:ml-0"
            >
              <Plus className="w-4 h-4 text-[#E8C99F]" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#211A14]">
            <thead className="bg-[#FAF6EE] border-b border-[#E8C99F]/50 uppercase tracking-wider text-[10px] text-[#736453]">
              <tr>
                <th className="py-3 px-4">Jewellery Item</th>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (NPR)</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const thumb = p.images?.[0] || "/images/necklace.jpg";
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <Image
                              src={thumb}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#211A14] line-clamp-1">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                              {p.featured && (
                                <span className="text-[#B88632] font-semibold">★ Featured</span>
                              )}
                              {p.is_demo && (
                                <span className="bg-[#FAF6EE] text-[#8F641B] px-1.5 py-0.2 rounded border border-[#E8C99F] text-[9px]">
                                  Demo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reference */}
                      <td className="py-3 px-4 font-mono font-bold text-[#B88632]">
                        {p.reference}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-stone-600">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-serif font-bold text-sm">
                        {formatNpr(p.price)}
                      </td>

                      {/* Status / Quick Toggle */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.availability === "available" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Available
                            </span>
                          )}
                          {p.availability === "sold_out" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                              Sold Out
                            </span>
                          )}
                          {p.availability === "hidden" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              Hidden
                            </span>
                          )}

                          {/* Quick change dropdown */}
                          <select
                            value={p.availability}
                            onChange={(e) =>
                              handleQuickStatusToggle(p, e.target.value as any)
                            }
                            aria-label={`Change availability for ${p.name}`}
                            className="text-[10px] bg-transparent border-0 text-stone-600 hover:text-[#211A14] cursor-pointer focus:outline-none"
                          >
                            <option value="available">Make Available</option>
                            <option value="sold_out">Mark Sold Out</option>
                            <option value="hidden">Hide Product</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.availability !== "hidden" && (
                            <Link
                              href={`/product/${p.id}`}
                              target="_blank"
                              title="Preview on Store"
                              className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-[#211A14]"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-1.5 rounded hover:bg-[#E8C99F]/30 text-stone-600 hover:text-[#B88632]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(p)}
                            title="Delete Product"
                            className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No jewellery items match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#B88632]/40 luxury-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#211A14]">
                  {isEditing ? "Edit Jewellery Piece" : "Add New Jewellery Piece"}
                </h3>
                <p className="text-xs text-[#736453]">
                  All details are permanently saved to the catalogue database.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Reference & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                    Unique Ref Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value.toUpperCase())}
                    placeholder="e.g. RC-101"
                    className="w-full px-3 py-2 rounded border border-stone-300 text-xs font-mono font-bold text-[#211A14] uppercase focus:ring-2 focus:ring-[#B88632]/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Heritage Jhumka Earrings"
                    className="w-full px-3 py-2 rounded border border-stone-300 text-xs text-[#211A14] focus:ring-2 focus:ring-[#B88632]/40"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                    Price in NPR (Nepalese Rupees) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full px-3 py-2 rounded border border-stone-300 text-xs font-bold text-[#211A14] focus:ring-2 focus:ring-[#B88632]/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-stone-300 text-xs text-[#211A14] focus:ring-2 focus:ring-[#B88632]/40"
                  >
                    {BRAND.categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                    Availability Status
                  </label>
                  <select
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-stone-300 text-xs text-[#211A14] focus:ring-2 focus:ring-[#B88632]/40"
                  >
                    <option value="available">Available (Public & Orderable)</option>
                    <option value="sold_out">Sold Out (Visible but not orderable)</option>
                    <option value="hidden">Hidden (Admin Draft - Never shown publicly)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6 gap-2">
                  <input
                    type="checkbox"
                    id="formFeatured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B88632] focus:ring-[#B88632]"
                  />
                  <label htmlFor="formFeatured" className="text-xs text-[#211A14] font-medium cursor-pointer">
                    Display in Homepage Featured Section
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                  Description & Specifications (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Details regarding styling, occasion, matching ornaments, etc."
                  className="w-full px-3 py-2 rounded border border-stone-300 text-xs text-[#211A14] focus:ring-2 focus:ring-[#B88632]/40"
                />
              </div>

              {/* Product Photograph Upload */}
              <div className="space-y-2 border-t border-stone-100 pt-3">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14]">
                  Product Photographs (Square Recommended) *
                </label>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-[#211A14] transition-colors">
                    <Upload className="w-4 h-4 text-[#B88632]" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-stone-500">
                    PNG, JPEG, WEBP up to 8MB
                  </span>
                </div>

                {/* Previews */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {formImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded border border-[#B88632]/40 overflow-hidden group bg-stone-100"
                    >
                      <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                      {formImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded bg-[#211A14] hover:bg-[#3D3228] text-white text-xs font-bold uppercase tracking-wider transition-colors border border-[#B88632]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl border border-red-200 luxury-shadow w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#211A14]">
                Confirm Product Deletion
              </h3>
            </div>

            <p className="text-xs text-[#736453] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong>&ldquo;{productToDelete.name}&rdquo;</strong> (Ref: {productToDelete.reference})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#B88632]/40 luxury-shadow w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#B88632]" />
                <h3 className="font-serif text-lg font-bold text-[#211A14]">
                  Update Admin Password
                </h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                  New Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#211A14] mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-4 py-2 rounded bg-[#211A14] text-white text-xs font-semibold uppercase tracking-wider border border-[#B88632]"
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
