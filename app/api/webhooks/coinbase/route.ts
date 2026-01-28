import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  // Runtime checks for environment variables
  if (!process.env.COINBASE_WEBHOOK_SECRET) {
    console.error("COINBASE_WEBHOOK_SECRET is not defined");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("x-cc-webhook-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing webhook signature" },
      { status: 400 },
    );
  }

  // Verify Coinbase webhook signature
  try {
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (computedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  const event = JSON.parse(body);

  // Handle the event
  switch (event.type) {
    case "charge:confirmed": {
      await handleChargeConfirmed(event.data);
      break;
    }
    case "charge:failed": {
      console.log("Charge failed:", event.data.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleChargeConfirmed(charge: any) {
  const coinbaseChargeId = charge.id;

  try {
    // Idempotency check: prevent duplicate processing
    const existingOrder = await client.fetch(
      `*[_type == "order" && coinbaseChargeId == $coinbaseChargeId][0]`,
      { coinbaseChargeId },
    );

    if (existingOrder) {
      console.log(
        `Webhook already processed for charge ${coinbaseChargeId}, skipping`,
      );
      return;
    }

    // Extract metadata from charge
    const metadata = charge.metadata || {};
    const {
      clerkUserId,
      userEmail,
      sanityCustomerId,
      productIds: productIdsString,
      quantities: quantitiesString,
    } = metadata;

    if (!clerkUserId || !productIdsString || !quantitiesString) {
      console.error("Missing metadata in Coinbase charge");
      return;
    }

    const productIds = productIdsString.split(",");
    const quantities = quantitiesString.split(",").map(Number);

    // Fetch product details to get prices
    const products = await client.fetch(
      `*[_id in $productIds]{_id, name, "price": coalesce(fixedPrice, 0)}`,
      { productIds },
    );

    const productMap = new Map(products.map((p: any) => [p._id, p]));

    // Build order items array
    const orderItems = productIds.map((productId: string, index: number) => {
      const product = productMap.get(productId);
      return {
        _key: `item-${index}`,
        product: {
          _type: "reference" as const,
          _ref: productId,
        },
        quantity: quantities[index],
        priceAtPurchase: product?.price || 0,
      };
    });

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Calculate total from pricing data
    const total = charge.pricing?.local?.amount
      ? parseFloat(charge.pricing.local.amount)
      : orderItems.reduce((sum: number, item: any) => sum + item.priceAtPurchase * item.quantity, 0);

    // Create order in Sanity
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      ...(sanityCustomerId && {
        customer: {
          _type: "reference",
          _ref: sanityCustomerId,
        },
      }),
      clerkUserId,
      email: userEmail,
      items: orderItems,
      total,
      status: "paid",
      coinbaseChargeId,
      paymentMethod: "crypto",
      cryptoCurrency: charge.pricing?.local?.currency || "CRYPTO",
      createdAt: new Date().toISOString(),
    });

    console.log(`Order created: ${order._id} (${orderNumber})`);

    // Decrease stock for all products in a single transaction
    await productIds
      .reduce(
        (tx: any, productId: string, i: number) =>
          tx.patch(productId, (p: any) => p.dec({ stock: quantities[i] })),
        writeClient.transaction(),
      )
      .commit();

    console.log(`Stock updated for ${productIds.length} products`);
  } catch (error) {
    console.error("Error handling charge:confirmed:", error);
    throw error; // Re-throw to return 500 and trigger retry
  }
}
