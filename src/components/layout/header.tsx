"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  X,
  ChevronDown,
  UserCircle2,
  ShoppingBagIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "./mobile-menu";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import {
  adminNavigation,
  Category,
  navigationItems,
  ProductType,
} from "@/lib/constants/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../global/loading";
import { useProductStore } from "@/store/productStore";
import { SearchComponent } from "../search/main-search-component";

export type NavigationItem = {
  title: string;
  hasDropdown: boolean;
  items: string[];
  href?: string;
};

interface HeaderProps {
  isHome: boolean;
}

export function Header({ isHome }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { products } = useProductStore();

  const categories: Category[] = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category!.id, p.category!])
    ).values()
  );

  // Debug: Log dropdown state changes
  useEffect(() => {
    console.log("Active dropdown changed to:", activeDropdown);
  }, [activeDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (!session?.user) {
    return null;
  }

  const isAdmin =
    session?.user.role === "admin" || session?.user.role === "super_admin";

  const handleMouseEnter = (index: number) => {
    console.log("Mouse enter on item:", index);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    console.log("Mouse leave");
    setActiveDropdown(null);
  };

  const handleSearch = (searchData: any) => {
    const searchParams = new URLSearchParams({
      q: searchData.term,
    });

    router.push(`/products?${searchParams.toString()}`);
    setIsSearchOpen(false); // Close mobile search if open
  };
  // Animation variants
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
  };

  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" as const },
    },
  };

  return (
    <motion.header
      className="shadow-sm border-b border-gray-200 top-0 z-[99999] backdrop-blur-md"
      variants={headerVariants}
      initial="initial"
      animate="animate"
      style={{ position: "relative" }}
    >
      {/* Top Navigation Bar */}
      <div className="bg-gray-300 border-b border-gray-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover="hover"
              variants={logoVariants}
            >
              <Link href="/home" className="flex items-center">
                <Image
                  src="/Images/logo_novel.png"
                  alt="Logo"
                  height={isScrolled || isHovered ? 150 : 150}
                  width={isScrolled || isHovered ? 150 : 150}
                  className="object-contain"
                />
              </Link>
            </motion.div>
            <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center space-x-6">
              {/* Search Bar */}
              <motion.div
                className="relative flex-1 z-[100000]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <SearchComponent
                  products={products}
                  categories={categories}
                  onSearch={handleSearch}
                />
              </motion.div>

              {/* Extra Nav Items */}
              <nav className="flex items-center space-x-6">
                <Link
                  href="/home"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  About Us
                </Link>
              </nav>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6">
              {/* Mobile Search Toggle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-600 hover:text-green-600"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isSearchOpen ? "close" : "search"}
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isSearchOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="premiumOutline"
                      className="h-10 w-10 p-0 rounded-full border-2 border-transparent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="z-[100000] w-56 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl"
                >
                  <DropdownMenuLabel className="font-normal p-4">
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
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/my-wishlist"
                      className="flex items-center p-3 hover:bg-red-50 transition-colors"
                    >
                      <Heart className="mr-3 h-4 w-4 text-red-500" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/settings"
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer p-3 hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-r from-green-200 to-green-400 shadow-sm relative"
        style={{
          position: "relative",
          zIndex: 30,
          overflow: "visible",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-center h-14 space-x-1"
            style={{ overflow: "visible" }}
          >
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="relative flex-shrink-0"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                style={{ position: "relative" }} // Ensure relative positioning
              >
                <button className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 font-medium text-sm whitespace-nowrap transition-all duration-200 rounded-lg hover:bg-white/50">
                  {item.title}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* FIXED: Simple dropdown without AnimatePresence initially */}
                {item.hasDropdown && item.items && activeDropdown === index && (
                  <div
                    className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      top: "100%",
                      left: "0",
                    }}
                  >
                    <div className="py-3">
                      {item.items?.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          variant="ghost"
                          className="w-full text-left block px-5 py-3 text-sm hover:bg-green-100 hover:text-green-600 transition-all duration-200 border-l-4 border-transparent hover:border-green-500"
                          onClick={() => {
                            router.push(`categories/${subItem.href}`);
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
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200 bg-white"
            variants={searchVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigationItems}
        modelIndex={0}
      />
    </motion.header>
  );
}
