"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserHeader } from "@/components/user/user-header";
import { useUser } from "@/components/user/user-provider";
import { UserSidebar } from "@/components/user/user-sidebar";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LoadingScreen } from "@/components/global/loading";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen description="products"/>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-transparent flex flex-col min-h-screen">
      <UserHeader/>
      <div>
        {/* Main content */}
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
      <Footer />
    </div>

  );
}
