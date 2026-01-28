import { NextRequest, NextResponse } from "next/server";

/**
 * Coinbase Commerce Checkout
 * Note: coinbase-commerce-node is deprecated. For production, use Coinbase Commerce API directly
 * or Coinbase SDK for more features
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, metadata, successUrl, cancelUrl } = body;

    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Coinbase Commerce not configured" },
        { status: 500 },
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    // Create charge using Coinbase Commerce API
    const chargeData = {
      name: "Gold Purchase",
      description: `Purchase of ${items.length} item(s)`,
      pricing_type: "fixed_price",
      local_price: {
        amount: totalAmount.toFixed(2),
        currency: "GBP",
      },
      metadata: {
        ...metadata,
        paymentProvider: "coinbase",
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.productId,
            name: item.name,
            quantity: item.quantity,
          })),
        ),
      },
      redirect_url:
        successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    };

    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to create Coinbase charge",
      );
    }

    const charge = await response.json();

    return NextResponse.json({
      chargeId: charge.data.id,
      chargeCode: charge.data.code,
      url: charge.data.hosted_url,
    });
  } catch (error: any) {
    console.error("Coinbase Commerce error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create crypto checkout" },
      { status: 500 },
    );
  }
}
