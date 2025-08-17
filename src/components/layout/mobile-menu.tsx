"use client";

import Link from "next/link";
import { X, User, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { teardownTraceSubscriber } from "next/dist/build/swc/generated-native";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { NavItem, ProductType } from "@/lib/constants/types";
import { NavigationItem } from "./header";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
  modelIndex: number;
}

export function MobileMenu({
  isOpen,
  onClose,
  navigation,
  modelIndex,
}: MobileMenuProps) {
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (index: any) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className={`w-full sm:w-80 p-0`}>
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-bold`}>Novel</span>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button> */}
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Section */}
        <div className="flex items-center justify-start h-12 space-x-1">
          {navigation.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 font-medium text-sm whitespace-nowrap transition-colors duration-200">
                {item.title}
                {item.hasDropdown && <ChevronDown className="ml-1 h-3 w-3" />}
              </button>

              {/* Dropdown Menu */}
              {item.hasDropdown && item.items && activeDropdown === index && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-3">
                    {item.items?.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className="w-full text-left block px-5 py-3 text-sm hover:bg-green-100 hover:text-green-600 transition-all duration-200 border-l-4 border-transparent hover:border-green-500"
                        onClick={() => {
                          router.push(subItem.href);
                          setActiveDropdown(null);
                        }}
                      >
                        {subItem.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-gray-200">
          <div className="px-6 py-4 space-y-2">
            <Link
              href="/auth/signin"
              onClick={onClose}
              className={`flex items-center space-x-3 py-3 px-3 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
            >
              <User className={`h-5 w-5 flex-shrink-0`} />
              <span className="text-sm font-medium">Account</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className={`flex items-center space-x-3 py-3 px-3 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
            >
              <Heart className={`h-5 w-5 flex-shrink-0`} />
              <span className="text-sm font-medium">Wishlist</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
