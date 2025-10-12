'use client'
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface BannerProps {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  bannerType: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryCard: React.FC<{ banner: BannerProps; index: number }> = ({ banner, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      <a
        href={`/categories${banner.linkUrl}` || '#'}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=250&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="px-1 py-1">
          <h3 className="mb-2 flex items-center justify-between text-lg font-semibold text-gray-900 transition-colors group-hover:text-green-600">
            <span>{banner.title}</span>
            <ArrowRight 
              className={`h-5 w-5 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`}
            />
          </h3>
        </div>
      </a>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="aspect-[16/10] animate-pulse bg-gray-200" />
        <div className="p-6">
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

export default function CategoriesPage() {
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/banners/active");
        
        if (!res.ok) {
          throw new Error(`Failed to fetch banners: ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Filter banners with priority === 3
        const filteredBanners = (data.banners || []).filter(
          (banner: BannerProps) => banner.priority === 3 && banner.bannerType === 'categories'
        );
        
        setBanners(filteredBanners);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Collections
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse our curated selection of products
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Unable to load categories
            </h3>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : banners.length === 0 ? (
          <div className="rounded-lg bg-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No categories available
            </h3>
            <p className="text-sm text-gray-600">
              Check back later for new categories
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner, index) => (
                <CategoryCard key={banner.id} banner={banner} index={index} />
              ))}
            </div>

            {/* Load More Section - Optional, can be used for pagination */}
            {banners.length >= 9 && (
              <div className="mt-16 text-center">
                <button className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md">
                  <span>Load More</span>
                  <div className="ml-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}