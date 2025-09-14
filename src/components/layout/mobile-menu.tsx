// "use client";

// import Link from "next/link";
// import { X, User, Heart, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { teardownTraceSubscriber } from "next/dist/build/swc/generated-native";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";

// import { NavItem, ProductType } from "@/lib/constants/types";
// import { NavigationItem } from "./header";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// interface MobileMenuProps {
//   isOpen: boolean;
//   onClose: () => void;
//   navigation: NavItem[];
// }

// export function MobileMenu({
//   isOpen,
//   onClose,
//   navigation,
// }: MobileMenuProps) {
//   const router = useRouter();
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const handleMouseEnter = (index: any) => {
//     setActiveDropdown(index);
//   };

//   const handleMouseLeave = () => {
//     setActiveDropdown(null);
//   };
//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent side="left" className={`w-full sm:w-80 p-0`}>
//         <SheetHeader className="p-6 pb-4">
//           <SheetTitle className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className={`text-xl font-bold`}>Novel</span>
//             </div>
//           </SheetTitle>
//         </SheetHeader>

//         {/* Navigation Section */}
//         <div className="flex items-center justify-start h-12 space-x-1">
//           {navigation.map((item, index) => (
//             <div
//               key={index}
//               className="relative"
//               onMouseEnter={() => handleMouseEnter(index)}
//               onMouseLeave={handleMouseLeave}
//             >
//               <button className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 font-medium text-sm whitespace-nowrap transition-colors duration-200">
//                 {item.title}
//                 {item.hasDropdown && <ChevronDown className="ml-1 h-3 w-3" />}
//               </button>

//               {/* Dropdown Menu */}
//               {item.hasDropdown && item.items && activeDropdown === index && (
//                 <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
//                   <div className="py-3">
//                     {item.items?.map((subItem, subIndex) => (
//                       <Button
//                         key={subIndex}
//                         variant="ghost"
//                         className="w-full text-left block px-5 py-3 text-sm hover:bg-green-100 hover:text-green-600 transition-all duration-200 border-l-4 border-transparent hover:border-green-500"
//                         onClick={() => {
//                           router.push(subItem.href);
//                           setActiveDropdown(null);
//                         }}
//                       >
//                         {subItem.title}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-auto border-t border-gray-200">
//           <div className="px-6 py-4 space-y-2">
//             <Link
//               href="/auth/signin"
//               onClick={onClose}
//               className={`flex items-center space-x-3 py-3 px-3 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
//             >
//               <User className={`h-5 w-5 flex-shrink-0`} />
//               <span className="text-sm font-medium">Account</span>
//             </Link>
//             <Link
//               href="/wishlist"
//               onClick={onClose}
//               className={`flex items-center space-x-3 py-3 px-3 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
//             >
//               <Heart className={`h-5 w-5 flex-shrink-0`} />
//               <span className="text-sm font-medium">Wishlist</span>
//             </Link>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

"use client";

import Link from "next/link";
import {
  X,
  User,
  Heart,
  ChevronDown,
  ChevronUp,
  Settings2,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NavItem } from "@/lib/constants/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
  modelIndex?: number;
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { data: session, status } = useSession();

  const handleAccordionToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSubItemClick = (href: string) => {
    router.push(href);
    setActiveDropdown(null);
    onClose(); // Close the entire mobile menu
  };

  const handleMainItemClick = (item: NavItem, index: number) => {
    if (item.hasDropdown && item.items) {
      // If it has dropdown, toggle accordion
      handleAccordionToggle(index);
    } else if (item) {
      onClose();
    }
  };

  // Animation variants
  const accordionVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-80 p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 border-b border-gray-200">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">Novel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Section */}
        <div className="flex-1 py-4">
          {/* Main Navigation Links */}
          <div className="px-4 space-y-2">
            <Link
              href="/home"
              onClick={onClose}
              className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
            >
              Contact
            </Link>

            <Link
              href="/support"
              onClick={onClose}
              className="flex items-center py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
            >
              Support
            </Link>

            <Link
              href="/b2b-enquiry"
              onClick={onClose}
              className="flex items-center py-3 px-4 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all duration-200 font-medium mx-2 mt-2"
            >
              B2B Enquiry
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Category Navigation */}
          <div className="px-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-4">
              Categories
            </h3>

            <div className="space-y-1">
              {navigation.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg overflow-hidden"
                >
                  {/* Main Category Button */}
                  <button
                    onClick={() => handleMainItemClick(item, index)}
                    className={`w-full flex items-center justify-between py-3 px-4 text-left transition-all duration-200 ${
                      activeDropdown === index
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    }`}
                  >
                    <span className="font-medium">{item.title}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {item.hasDropdown &&
                    item.items &&
                    activeDropdown === index && (
                      <div className="overflow-hidden bg-gray-50 border-t border-gray-200">
                        <div className="py-2">
                          {item.items.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => handleSubItemClick(subItem.href)}
                              className="w-full text-left py-2.5 px-6 text-sm text-gray-600 hover:text-green-600 hover:bg-white transition-all duration-200 border-l-4 border-transparent hover:border-green-500"
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* User Info Section */}
          <div className="mt-6 border-t border-gray-200 pt-4 px-4 space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            <Link
              href="/my-wishlist"
              className="flex items-center p-3 rounded-md hover:bg-red-50 transition-colors"
            >
              <Heart className="mr-3 h-4 w-4 text-red-500" />
              Wishlist
            </Link>

            <Link
              href="/settings"
              className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              Settings
            </Link>

            <button
              onClick={() => signOut()}
              className="flex items-center p-3 rounded-md hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
