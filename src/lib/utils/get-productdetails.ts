// utils/productDetails.ts
import { db } from "@/lib/db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";
import { ProductType } from "../constants/types";


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


