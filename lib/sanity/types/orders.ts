/**
 * Type definitions for order queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/orders.ts
 */

export interface OrderListItem {
  _id: string;
  orderNumber: string | null;
  total: number | null;
  status: string | null;
  createdAt: string | null;
  itemCount: number | null;
  itemNames: (string | null)[] | null;
  itemImages: (string | null)[] | null;
}

export interface OrderDetailItem {
  _key: string;
  quantity: number | null;
  priceAtPurchase: number | null;
  product: {
    _id: string;
    name: string | null;
    slug: string | null;
    image: {
      asset: {
        _id: string;
        url: string | null;
      } | null;
    } | null;
  } | null;
}

export interface OrderDetail {
  _id: string;
  orderNumber: string | null;
  clerkUserId: string | null;
  email: string | null;
  items: OrderDetailItem[] | null;
  total: number | null;
  status: string | null;
  address: {
    name: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    postcode: string | null;
    country: string | null;
  } | null;
  stripePaymentId: string | null;
  createdAt: string | null;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string | null;
  email: string | null;
  total: number | null;
  status: string | null;
  createdAt: string | null;
}
