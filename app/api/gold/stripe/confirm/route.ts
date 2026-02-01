import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { writeClient } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }
  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    // Prepare digital gold order data for Sanity
    const order = {
      _type: "digitalGoldOrder",
      orderNumber: session.id,
      items: lineItems.data.map((item) => {
        const product = item.price?.product;
        let productRef = undefined;
        if (product && typeof product === "object" && "metadata" in product && product.metadata?.sku) {
          productRef = { _type: "reference", _ref: product.metadata.sku };
        }
        return {
          product: productRef,
          quantity: item.quantity,
          priceAtPurchase: item.amount_total / 100,
        };
      }),
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: session.payment_status,
      email: session.customer_details?.email || "",
      createdAt: new Date().toISOString(),
    };
    // Save to Sanity
    const sanityRes = await writeClient.create(order);
    return NextResponse.json({ orderId: sanityRes._id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
