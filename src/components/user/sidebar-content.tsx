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

export default function SidebarContent({
  pathname,
  user,
  onLinkClick,
}: {
  pathname: string;
  user: any;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="p-4">

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account
            </h4>
            {userNavigation.map((item) => {
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
                      : "text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {/* {item.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        isActive
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )} */}
                </Link>
              );
            })}
          </nav>
          {/* Quick Actions */}
          <div className="mb-6 mt-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto p-3 flex flex-col items-center gap-2 border-amber-100 hover:bg-amber-50 bg-transparent transition-colors"
                    onClick={onLinkClick}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}
                    >
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-center">{action.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          {/* <Card className="border-amber-100 mt-6 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">Special Offer</h4>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Get 20% off on your next order! Use code: BEAUTY20
              </p>
              <Button
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
