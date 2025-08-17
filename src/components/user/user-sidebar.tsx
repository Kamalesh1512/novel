"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  Crown,
  Gift,
  Bell,
  HelpCircle,
  Star,
  Package,
  Truck,
  RotateCcw,
  X,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "./user-provider";
import { userNavigation, quickActions } from "@/lib/constants/types";
import SidebarContent from "./sidebar-content";


export function UserSidebar({
  isMobileMenuOpen,
  setMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="inset-y-0 left-0 z-40 w-80 bg-white border-r hidden lg:block">
        <SidebarContent
          pathname={pathname}
          user={user}
        />
      </div>
      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 w-80 h-full bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              pathname={pathname}
              user={user}
            />
          </div>
        </div>
      )}
    </>
  );
}


