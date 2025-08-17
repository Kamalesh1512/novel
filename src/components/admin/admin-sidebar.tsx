"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tag,
  HomeIcon,
  Star,
  Menu,
  Gift,
  X,
  LayoutDashboard,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Gideon_Roman } from "next/font/google";

const navigation = [
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Admin Users", href: "/admin/admin-users", icon: User },
  { name: "Banners", href: "/admin/banners", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Coupons", href: "/admin/coupons", icon: Gift },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: Settings },

];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 hidden lg:block">
        <SidebarContent pathname={pathname} />
      </div>

      {/* Mobile Header with Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo_with_horse.png" alt="Logo" height={40} width={40} />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md border bg-gray-50 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
        onClick={() => setMobileMenuOpen(false)} // 👈 Closes when clicking outside
      >
        <div
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()} // 👈 Prevent closing when clicking inside
        >
          <SidebarContent
            pathname={pathname}
            onLinkClick={() => setMobileMenuOpen(false)} // 👈 Closes when clicking a link
          />
        </div>
      </div>
      )}
    </>
  );
}

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo_with_horse.png" alt="Logo" height={50} width={50} />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gradient-to-b from-[#f7d488] text-[#1f1f1f] uppercase border shadow-md hover:brightness-110"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
