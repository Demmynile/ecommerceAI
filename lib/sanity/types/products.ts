/**
 * Type definitions for product queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/products.ts
 */

export interface ProductImage {
  _key: string;
  asset: {
    _id: string;
    url: string | null;
  } | null;
  hotspot: {
    x: number;
    y: number;
    height: number;
    width: number;
  } | null;
}

export interface ProductCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface FeaturedProduct {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: ProductImage[];
  category: ProductCategory | null;
  stock: number;
}

export type FeaturedProductList = FeaturedProduct[];
