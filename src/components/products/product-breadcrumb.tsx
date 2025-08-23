
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProductBreadcrumbProps {
  productName: string;
  onGoBack: () => void;
}

export const ProductBreadcrumb = ({ productName, onGoBack }: ProductBreadcrumbProps) => {
  return (
    <motion.div
      className="flex items-center gap-2 mb-6 lg:mb-8 text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Button variant="ghost" size="sm" onClick={onGoBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Products
      </Button>
      <span className="text-gray-400">/</span>
      <span className="text-gray-900 truncate">{productName}</span>
    </motion.div>
  );
};