'use client'
import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { UserHeader } from "@/components/user/user-header";
import { AnimatePresence, motion } from "framer-motion";
import WhatsAppButton from "@/components/global/interactive/whatsAppbutton";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div>
        <Header isHome={false} />
        <main className="m-0 p-0">
          {children}
          <div>
            <AnimatePresence>
              <motion.div
                className="fixed bottom-6 right-6 z-50"
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
        <Footer />
      </div>
    </div>
  );
}
