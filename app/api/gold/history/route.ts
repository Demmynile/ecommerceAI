import { NextRequest, NextResponse } from "next/server";
import { getGoldPriceHistory } from "@/lib/services/gold-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/gold/history
 * Returns historical gold price data
 * Query params: ?days=30 (optional, defaults to 30)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number.parseInt(daysParam, 10) : 30;

    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Days must be between 1 and 365" },
        { status: 400 },
      );
    }

    const history = await getGoldPriceHistory(days);

    return NextResponse.json({
      data: history,
      period: `${days} days`,
      count: history.length,
    });
  } catch (error) {
    console.error("Error in gold history API:", error);
    return NextResponse.json(
      { error: "Failed to fetch gold price history" },
      { status: 500 },
    );
  }
}
