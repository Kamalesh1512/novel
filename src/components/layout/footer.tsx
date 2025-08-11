"use client";
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  InstagramIcon,
  Truck,
  Banknote,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";

const Footer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const footerLinks = {
    company: [
      { name: "Get in Touch", href: "/contact" },
      { name: "About us", href: "/about" },
      { name: "Contact us", href: "/contact" },
      { name: "Blogs", href: "/blogs" },
    ],
    policies: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Pricing", href: "/pricing" },
      { name: "Return Policy", href: "/return-policy" },
      { name: "Terms and Conditions", href: "/terms-conditions" },
      { name: "Shipping Policy", href: "/shipping-policy" },
    ],
  };


  return (
    <footer
      className="bg-transparent text-white relative overflow-hidden"
    >
      {/* Background Lion Silhouette */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="h-full w-full bg-gradient-to-l from-amber-500/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">


        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <Link href="/home" className="flex items-center space-x-2">
                <img
                  src={"/images/logo_novel.png"}
                  alt="Logo"
                  height={150}
                  width={150}
                />
              </Link>
            </div>

            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              For Story Creators
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">
              Our Policies
            </h3>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            {/* Social Media */}
            <div className="flex gap-2 mt-6">
              <Button variant="premium" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook size={500} />
                </a>
              </Button>
              <Button
                size="icon"
                variant={'premium'}
                asChild
              >
                <a href="#" aria-label="Instagram">
                  <InstagramIcon className="" />
                </a>
              </Button>
              <Button variant="premium" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter />
                </a>
              </Button>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Get exclusive offers and updates on our latest products.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              />
              <Button className="w-full" variant="premium">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                COPYRIGHT © 2025 ALMA COSMETICS. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
