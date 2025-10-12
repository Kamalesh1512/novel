"use client";

import { useEffect, useState } from "react";

interface Miscellaneous {
  id: string;
  title: string;
  content: string;
  priority: number;
}

// Alternative: Single miscellaneous section component
export function MiscellaneousSection({ id }: { id: string }) {
  const [miscellaneous, setMiscellaneous] = useState<Miscellaneous | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMiscellaneous();
  }, [id]);

  const fetchMiscellaneous = async () => {
    try {
      const res = await fetch("/api/miscellaneous");
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      const item = data.find((m: Miscellaneous) => m.id === id);
      setMiscellaneous(item || null);
    } catch (error) {
      console.error("Error fetching miscellaneous content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!miscellaneous) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold mb-4">{miscellaneous.title}</h2>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: miscellaneous.content }}
      />
    </section>
  );
}