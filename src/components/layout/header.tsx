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

import Image from "next/image";
import { adminNavigation, ProductType } from "@/lib/constants/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../global/loading";

export type NavigationItem =
  | { name: string; href: string; children?: undefined }
  | { name: string; children: { name: string; href: string }[]; href?: string };

const navigation = [
  { name: "Home", href: "/home" },
  {
    name: "Categories",
    children: [
      { name: "Premium Perfumes", href: "/categories/premium-perfumes" },
      { name: "Perfumes", href: "/categories/perfumes" },
      { name: "Shower Gels", href: "/categories/shower-gels" },
    ],
  },
  { name: "Crazy Deals", href: "/scent-sational-deals" },
  { name: "Contact", href: "/contact" },
];

interface HeaderProps {
  isHome: boolean;
}

export function Header({ isHome }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  if (status === "loading") {
    return <LoadingScreen description="" />;
  }

  if (!session?.user) {
    return null;
  }

  const isAdmin =
    session?.user.role === "admin" || session?.user.role === "super_admin";

  return (
    <header
      className={`${
        isScrolled
          ? "fixed top-0 bg-black text-white shadow-md"
          : "absolute top-0"
      } z-50 w-full transition-all duration-300 ${
        isHome
          ? isScrolled || isHovered
            ? "bg-black"
            : "bg-transparent"
          : "bg-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/home" className="flex items-center">
              <Image
                src={`${
                  isHome
                    ? "/images/logo_novel.png"
                    : "/images/logo_novel.png"
                }`}
                alt="Logo"
                height={isScrolled || isHovered ? 50 : 73}
                width={isScrolled || isHovered ? 50 : 73}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center space-x-6 ${
              isHome ? "text-white" : "text-black"
            }`}
          >
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger
                    className={`text-sm ${
                      isHome ? "text-white" : "text-black"
                    } font-medium transition-colors inline-flex items-center gap-1`}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {item.children.map((subItem) => (
                      <DropdownMenuItem asChild key={subItem.name}>
                        <Link href={subItem.href} className="w-full">
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            {/* <Button
              variant="link"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button> */}

            {/* Wishlist */}
            <Button
              variant="link"
              size="icon"
              asChild
              className={`hidden sm:flex p-2 ${
                isHome ? "text-white" : "text-black"
              }`}
            >
              <Link href="/my-wishlist">
                <Heart className={`h-5 w-5`} />
              </Link>
            </Button>

            {/* Account */}
            {/* <Button
              variant="link"
              size="icon"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/auth/signin" className={`${textColor}`}>
                <UserCircle2 className={`h-15 w-5 ${textColor}`}/>
                  Login
              </Link>
            </Button> */}

            {/* Cart */}
            {/* <Button
              variant="link"
              size="icon"
              className={`relative p-2 ${
                isHome ? "text-white" : "text-black"
              } `}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBagIcon className={`h-5 w-5`} />
              {totalItems > 0 && (
                <Badge
                  className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500`}
                >
                  {totalItems}
                </Badge>
              )}
            </Button> */}

            {isAdmin ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="premiumOutline"
                      className="h-8 w-8 p-0 rounded-full border border-gray-600 ml-2"
                    >
                      <Avatar className="h-8 w-8 bg-transparent">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-full"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {adminNavigation.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="premiumOutline"
                      className="h-8 w-8 p-0 rounded-full border border-gray-600 ml-2"
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
                    <DropdownMenuItem asChild>
                      <Link href="/my-orders">
                        <User className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {/* {isSearchOpen && (
          <div className={`lg:hidden py-4 border-t`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className={`pl-10 bg-white border-0 focus:bg-white ${textColor}`}
              />
            </div>
          </div>
        )} */}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        modelIndex={0}
      />

    </header>
  );
}
