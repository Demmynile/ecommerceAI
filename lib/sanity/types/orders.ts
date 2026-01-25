/**
 * Type definitions for order queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/orders.ts
 */

export interface OrderListItem {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  itemNames: (string | null)[];
  itemImages: (string | null)[];
}

export interface OrderDetailItem {
  _key: string;
  quantity: number;
  priceAtPurchase: number;
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
  orderNumber: string;
  clerkUserId: string;
  email: string;
  items: OrderDetailItem[];
  total: number;
  status: string;
  address: {
    name: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    postcode: string | null;
    country: string | null;
  };
  stripePaymentId: string | null;
  createdAt: string;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
}
