"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "./user-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingBag,
  Heart,
  LogOut,
  User,
  Settings,
  Bell,
  Menu,
  ShoppingBagIcon,
  MenuIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Category, userNavigation } from "@/lib/constants/types";
import { SearchComponent } from "../search/main-search-component";
import { useProductStore } from "@/store/productStore";

export function UserHeader() {
  const { products } = useProductStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const categories: Category[] = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category!.id, p.category!])
    ).values()
  );

  // Handle search from header
  const handleSearch = (searchData: any) => {
    // Navigate to products page with search params
    const searchParams = new URLSearchParams({
      q: searchData.term,
      // Add other filters if needed
    });

    router.push(`/products?${searchParams.toString()}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-black sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between w-full px-14">
          {/* Left: Hamburger menu (mobile only) and logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/Images/logo_novel.png"
                alt="Logo"
                height={150}
                width={150}
              />
            </Link>
            {/* Center: Search (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-4xl mx-8">
              <SearchComponent
                products={products}
                categories={categories}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notification
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white p-2"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button> */}

            {/* User Naviagtions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full border border-gray-600 ml-1"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {userNavigation.map((item, i) => (
                  <DropdownMenuItem key={i} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="cursor-pointer">{item.name}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700 mt-3">
            <div className="px-4 md:px-14">
              <SearchComponent
                products={products}
                categories={categories}
                onSearch={handleSearch}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
