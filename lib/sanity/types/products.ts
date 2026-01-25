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

// Filtered product (used in product grids and lists)
export interface FilteredProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: ProductImage[]; // First 4 images for hover effect
  category: ProductCategory | null;
  country: string | null;
  carat: string | null;
  stock: number;
}

export type FilteredProductList = FilteredProduct[];

// Paginated results wrapper
export interface PaginatedProducts {
  total: number;
  results: FilteredProductList;
}
