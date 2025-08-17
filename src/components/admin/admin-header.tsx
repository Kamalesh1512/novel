"use client";

import { useSession, signOut } from "next-auth/react";
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
  LogOut,
  User,
  Settings,
  MoveLeftIcon,
  LucideMoveLeft,
  HomeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminNavigation } from "@/lib/constants/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function AdminHeader() {
  const { data: session, status } = useSession();

  const role = session?.user?.role;
  const router = useRouter();

  return (
    <header className="bg-gray-200 border-b border-gray-200 px-2 py-4">
      <div className="flex items-center justify-between px-14">
        <div>
          <Link href="/admin/products" className="flex items-center space-x-2">
            <Image
              src={"/Images/logo_novel.png"}
              alt="Logo"
              height={150}
              width={150}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* <Button
            variant={"premiumOutline"}
            onClick={() => router.push("/home")}
            size={"icon"}
          >
            <HomeIcon />
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="premiumOutline"
                className="relative h-8 w-8 rounded-full"
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

              {adminNavigation.map((item, i) => (
                <DropdownMenuItem key={i} asChild>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
