import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Outfit,
  Bebas_Neue,
  Michroma,
  Poppins,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

import { Header } from "@/components/layout/header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VisitorTracking } from "@/components/global/visitor-tracking";
import SessionProviders from "@/provider/session-provider";


export const metadata: Metadata = {
  title: "Novel - Babio Naturals",
  description: "Novel tissues",
  keywords: "cosmetics, skincare, bodycare, fragrance, 3D, premium, beauty",
  authors: [{ name: "ALMA" }],
  openGraph: {
    title: "Novel",
    description: "Discover premium products with interactive 3D experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novel - Babio Naturals",
    description: "Discover premium products with interactive 3D experiences.",
  },
  icons: "/images/logo_novel.png",
};

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviders>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("bg-transparent", poppins.className)}
          suppressHydrationWarning
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
              {/* <VisitorTracking /> */}
            </main>
          </div>
          <Toaster />
        </body>
      </html>
    </SessionProviders>
  );
}
