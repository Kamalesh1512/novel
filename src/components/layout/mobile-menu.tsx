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
import { NavigationItem } from "./header";
import { ProductType } from "@/lib/constants/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  modelIndex: number;
}

export function MobileMenu({
  isOpen,
  onClose,
  navigation,
  modelIndex,
}: MobileMenuProps) {

  return (
    // <Sheet open={isOpen} onOpenChange={onClose}>
    //   <SheetContent side="left" className={`w-full sm:w-80 ${bgColor}`}>
    //     <SheetHeader>
    //       <SheetTitle className="flex items-center justify-between">
    //         <div className="flex items-center space-x-2">
    //           <span className={`text-xl font-bold ${textColor}`}>Alma</span>
    //         </div>
    //         {/* <Button variant="ghost" size="icon" onClick={onClose}>
    //           <X className="h-5 w-5" />
    //         </Button> */}
    //       </SheetTitle>
    //     </SheetHeader>

    //     <div className="mt-8 space-y-4 p-5">
    //       {navigation.map((item) =>
    //         item.children ? (
    //           <DropdownMenu key={item.name}>
    //             <DropdownMenuTrigger
    //               className={`text-sm font-medium ${textColor} transition-colors inline-flex items-center gap-1`}
    //             >
    //               {item.name}
    //               <ChevronDown className="w-4 h-4" />
    //             </DropdownMenuTrigger>
    //             <DropdownMenuContent className="w-40">
    //               {item.children.map((subItem) => (
    //                 <DropdownMenuItem asChild key={subItem.name}>
    //                   <Link href={subItem.href} className="w-full">
    //                     {subItem.name}
    //                   </Link>
    //                 </DropdownMenuItem>
    //               ))}
    //             </DropdownMenuContent>
    //           </DropdownMenu>
    //         ) : (
    //           <Link
    //             key={item.name}
    //             href={item.href}
    //             className={`text-sm font-medium ${textColor} transition-colors`}
    //           >
    //             {item.name}
    //           </Link>
    //         )
    //       )}
    //     </div>

    //     <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 p-5">
    //       <Link
    //         href="/auth/signin"
    //         onClick={onClose}
    //         className={`flex items-center space-x-3 py-2 ${textColor} transition-colors`}
    //       >
    //         <User className={`h-5 w-5 ${textColor}`} />
    //         <span>Account</span>
    //       </Link>
    //       <Link
    //         href="/wishlist"
    //         onClick={onClose}
    //         className={`flex items-center space-x-3 py-2 ${textColor} transition-colors`}
    //       >
    //         <Heart className={`h-5 w-5 ${textColor}`} />
    //         <span>Wishlist</span>
    //       </Link>
    //     </div>
    //   </SheetContent>
    // </Sheet>
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
    <div className="px-6 py-4">
      <nav className="space-y-3">
        {navigation.map((item) =>
          item.children ? (
            <DropdownMenu key={item.name}>
              <DropdownMenuTrigger
                className={`w-full text-left text-sm font-medium  transition-colors inline-flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
              >
                <span>{item.name}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {item.children.map((subItem) => (
                  <DropdownMenuItem asChild key={subItem.name}>
                    <Link 
                      href={subItem.href} 
                      className="w-full px-3 py-2 text-sm"
                      onClick={onClose}
                    >
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
              onClick={onClose}
              className={`block w-full text-left text-sm font-medium transition-colors py-2 px-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200`}
            >
              {item.name}
            </Link>
          )
        )}
      </nav>
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
