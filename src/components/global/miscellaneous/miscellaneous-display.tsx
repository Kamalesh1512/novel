// components/global/miscellaneous-display.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Miscellaneous {
  id: string;
  title: string;
  content: string;
  priority: number;
}

interface MiscellaneousDisplayProps {
  priority?: number;
}

export function MiscellaneousDisplay({ priority = 1 }: MiscellaneousDisplayProps) {
  const [miscellaneous, setMiscellaneous] = useState<Miscellaneous | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMiscellaneous();
  }, [priority]);

  const fetchMiscellaneous = async () => {
    try {
      const res = await fetch("/api/miscellaneous/active");
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      
      // Find the specific record with matching priority
      const record = data.find((item: Miscellaneous) => item.priority === priority);
      setMiscellaneous(record || null);
    } catch (error) {
      console.error("Error fetching miscellaneous content:", error);
      setMiscellaneous(null);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while loading or if no matching record found
  if (loading || !miscellaneous) {
    return null;
  }

  return (
    <motion.section
      className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              {/* Title */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800">
                  {miscellaneous.title}
                </h3>
              </motion.div>

              {/* HTML Content */}
              <motion.div
                className="prose prose-sm sm:prose lg:prose-lg max-w-none 
                           prose-headings:text-green-800 
                           prose-p:text-gray-700 
                           prose-a:text-green-600 
                           prose-strong:text-green-700
                           prose-ul:text-gray-700
                           prose-ol:text-gray-700
                           prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: miscellaneous.content }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}