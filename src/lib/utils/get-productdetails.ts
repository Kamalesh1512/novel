// utils/productDetails.ts
import { db } from "@/lib/db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";
import { ProductType } from "../constants/types";
import { OrderItem } from "../delivery-service/order-service";

export async function getProductDetails(productId: string) {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    return product ?? null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

export async function prepareOrderItems(cartItems: any[]) {
  const order_items = await Promise.all(
    cartItems.map(async (item: any) => {
      const product = await getProductDetails(item.productId);
      const sku = product?.sku || "unknown";

      return {
        ...item,
        name: product?.name,
        sku: sku,
        discount: item.total - item.price,
        // hsn: "1234"
      };
    })
  );
  return order_items;
}
