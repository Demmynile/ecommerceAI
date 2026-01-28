"use server";

import { client } from "@/sanity/lib/client";

interface StockUpdateItem {
  productId: string;
  quantity: number;
}

/**
 * Deduct stock from products after successful payment
 * @param items - Array of items with productId and quantity
 * @returns Success status
 */
export async function deductStock(
  items: StockUpdateItem[],
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build mutations to reduce stock for each product
    const mutations = items.map((item) => ({
      patch: {
        id: item.productId,
        dec: { stock: item.quantity },
      },
    }));

    const result = await client
      .config({
        token: process.env.SANITY_API_WRITE_TOKEN,
        apiVersion: "2024-01-15",
      })
      .transaction(mutations)
      .commit();

    console.log("Stock deducted successfully:", result);
    return { success: true };
  } catch (error) {
    console.error("Error deducting stock:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Restore stock if payment fails or order is cancelled
 * @param items - Array of items with productId and quantity
 * @returns Success status
 */
export async function restoreStock(
  items: StockUpdateItem[],
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build mutations to increase stock for each product
    const mutations = items.map((item) => ({
      patch: {
        id: item.productId,
        inc: { stock: item.quantity },
      },
    }));

    const result = await client
      .config({
        token: process.env.SANITY_API_WRITE_TOKEN,
        apiVersion: "2024-01-15",
      })
      .transaction(mutations)
      .commit();

    console.log("Stock restored successfully:", result);
    return { success: true };
  } catch (error) {
    console.error("Error restoring stock:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get current stock level for a product
 * @param productId - Product ID
 * @returns Current stock count
 */
export async function getProductStock(
  productId: string,
): Promise<number | null> {
  try {
    const product = await client.fetch<{ stock: number } | null>(
      `*[_id == $productId][0]{ stock }`,
      { productId },
    );
    return product?.stock ?? null;
  } catch (error) {
    console.error("Error fetching product stock:", error);
    return null;
  }
}

/**
 * Check if products have sufficient stock
 * @param items - Array of items with productId and quantity
 * @returns Object with availability status and out-of-stock items
 */
export async function checkStockAvailability(items: StockUpdateItem[]): Promise<{
  available: boolean;
  outOfStock: Array<{ productId: string; requested: number; available: number }>;
}> {
  try {
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch<Array<{ _id: string; stock: number }>>(
      `*[_id in $productIds]{ _id, stock }`,
      { productIds },
    );

    const stockMap = new Map(products.map((p) => [p._id, p.stock]));
    const outOfStock: Array<{
      productId: string;
      requested: number;
      available: number;
    }> = [];

    for (const item of items) {
      const availableStock = stockMap.get(item.productId) ?? 0;
      if (availableStock < item.quantity) {
        outOfStock.push({
          productId: item.productId,
          requested: item.quantity,
          available: availableStock,
        });
      }
    }

    return {
      available: outOfStock.length === 0,
      outOfStock,
    };
  } catch (error) {
    console.error("Error checking stock availability:", error);
    return { available: false, outOfStock: [] };
  }
}
