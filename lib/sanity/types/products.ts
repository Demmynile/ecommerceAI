/**
 * Type definitions for product queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/products.ts
 */

import type { SanityImageHotspot } from "@/sanity.types";

export interface ProductImage {
  _key: string;
  asset: {
    _id: string;
    url: string | null;
  } | null;
  hotspot: SanityImageHotspot | null;
}

export interface ProductCategory {
  _id: string;
  title: string | null;
  slug: string | null;
}

export interface FeaturedProduct {
  _id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  images: ProductImage[] | null;
  category: ProductCategory | null;
  stock: number | null;
}

export type FeaturedProductList = FeaturedProduct[];

// Filtered product (used in product grids and lists)
export interface FilteredProduct {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  images: ProductImage[] | null; // First 4 images for hover effect
  category: ProductCategory | null;
  country: string | null;
  carat: string | null;
  stock: number | null;
}

export type FilteredProductList = FilteredProduct[];

// Paginated results wrapper
export interface PaginatedProducts {
  total: number;
  results: FilteredProductList;
}

// Product detail (full product information for product page)
export interface ProductDetail {
  _id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  images: ProductImage[] | null;
  category: ProductCategory | null;
  material: string | null;
  color: string | null;
  dimensions: string | null;
  stock: number | null;
  featured: boolean | null;
  assemblyRequired: boolean | null;
  carat: string | null;
  country: string | null;
}

// AI Search product (used by AI shopping assistant)
export interface AISearchProduct {
  _id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  image: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  category: ProductCategory | null;
  carat: string | null;
  country: string | null;
  dimensions: string | null;
  stock: number | null;
  featured: boolean | null;
  assemblyRequired: boolean | null;
}

export type AISearchProductList = AISearchProduct[];
