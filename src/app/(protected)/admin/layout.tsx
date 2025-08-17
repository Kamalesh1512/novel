// src/app/(auth)/auth/admin/layout.tsx
import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "super_admin")
  ) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
