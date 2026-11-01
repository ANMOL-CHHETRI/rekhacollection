import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllProducts, getProductStats } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Rekha Collection Management",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const products = getAllProducts(true);
  const stats = getProductStats();

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminDashboard
          initialProducts={products}
          initialStats={stats}
          adminUsername={session.username}
        />
      </div>
    </div>
  );
}
