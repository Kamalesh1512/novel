// "use client";
// import { ProductType } from "@/lib/constants/types";
// import React, { useEffect } from "react";

// import { LoadingScreen } from "../global/loading";
// import ProductCard from "./product-card";

// interface YouMayAlsoLikeProps {
//   products: ProductType[];
//   loading?: boolean;
//   onLoad?: () => void;
// }

// export default function YouMayAlsoLike({
//   products,
//   loading = false,
//   onLoad,
// }: YouMayAlsoLikeProps) {
//   // Show loading skeleton while loading
//   if (loading) {
//     return <LoadingScreen description="" />;
//   }

//   // Handle the onLoad callback when products are rendered
//   useEffect(() => {
//     if (products.length > 0 && onLoad) {
//       const timeout = setTimeout(() => {
//         onLoad();
//       }, 100);
//       return () => clearTimeout(timeout);
//     }
//   }, [products, onLoad]);

//   return (
//     <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
//       {/* Header */}
//       <div className="text-center mb-6 sm:mb-10">
//         <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
//           You May Also Like
//         </h2>
//       </div>

//       {products.length === 0 ? (
//         <div className="text-center py-12">
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
//             No Related Products
//           </h3>
//           <p className="text-gray-600">
//             No related products available at the moment.
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Mobile: Horizontal scrolling */}
//           <div className="block sm:hidden">
//             <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-3 px-3">
//               {products.map((product, index) => (
//                 <div key={product.id} className="flex-none w-64">
//                   <ProductCard product={product} index={index} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Desktop/Tablet: Grid layout with vertical scroll */}
//           <div className="hidden sm:block">
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
//               {products.map((product, index) => (
//                 <ProductCard key={product.id} product={product} index={index} />
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import { ProductType } from "@/lib/constants/types";
import React, { useEffect } from "react";

import { LoadingScreen } from "../global/loading";
import ProductCard from "./product-card";

interface YouMayAlsoLikeProps {
  products: ProductType[];
  loading?: boolean;
  onLoad?: () => void;
}

export default function YouMayAlsoLike({
  products,
  loading = false,
  onLoad,
}: YouMayAlsoLikeProps) {
  // Show loading skeleton while loading
  if (loading) {
    return <LoadingScreen description="" />;
  }

  // Handle the onLoad callback when products are rendered
  useEffect(() => {
    if (products.length > 0 && onLoad) {
      const timeout = setTimeout(() => {
        onLoad();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [products, onLoad]);

  const useHorizontalScrollDesktop = products.length > 4;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          You May Also Like
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            No Related Products
          </h3>
          <p className="text-gray-600">
            No related products available at the moment.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal scrolling */}
          <div className="block sm:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-3 px-3">
              {products.map((product, index) => (
                <div key={product.id} className="flex-none w-64">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop/Tablet */}
          {useHorizontalScrollDesktop ? (
            // Horizontal scroll for more than 4 products
            <div className="hidden sm:flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-3 px-3">
              {products.map((product, index) => (
                <div key={product.id} className="flex-none w-64">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            // Grid layout for 4 or fewer products
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
