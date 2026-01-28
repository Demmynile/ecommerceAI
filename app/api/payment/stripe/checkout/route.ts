import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, metadata, successUrl, cancelUrl } = body;

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images || [],
          metadata: {
            productId: item.productId,
            productType: item.productType || "product",
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to pence
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        ...metadata,
        paymentProvider: "stripe",
      },
      customer_email: metadata?.email,
      shipping_address_collection: metadata?.requiresShipping
        ? { allowed_countries: ["GB", "US", "CA", "AU"] }
        : undefined,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
