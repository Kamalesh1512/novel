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
import WhatsAppButton from "@/components/global/interactive/whatsAppbutton";
import { AnimatePresence,motion } from "framer-motion";

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
      <div>
        <Header isHome={false}/>
        <main className="">{children}
                    <div>
                      <AnimatePresence>
                        <motion.div
                          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2, duration: 0.5 }}
                        >
                          {/* WhatsApp Button */}
                          <WhatsAppButton />
                        </motion.div>
                      </AnimatePresence>
                    </div>
        </main>
        <Footer/>
      </div>
    </div>

  );
}
