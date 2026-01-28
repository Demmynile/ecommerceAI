import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentGoldPrice,
  convertGoldPrice,
} from "@/lib/services/gold-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

/**
 * GET /api/gold/price
 * Returns current gold spot price
 * Query params: ?currency=GBP (optional, defaults to USD)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get("currency") || "USD";

    const goldPrice = await getCurrentGoldPrice();

    // Convert to requested currency
    const convertedPrice = convertGoldPrice(
      goldPrice.price,
      goldPrice.currency,
      currency,
    );

    return NextResponse.json({
      price: convertedPrice,
      currency,
      unit: goldPrice.unit,
      timestamp: goldPrice.timestamp,
      lastUpdated: new Date(goldPrice.timestamp).toISOString(),
    });
  } catch (error) {
    console.error("Error in gold price API:", error);
    return NextResponse.json(
      { error: "Failed to fetch gold price" },
      { status: 500 },
    );
  }
}
