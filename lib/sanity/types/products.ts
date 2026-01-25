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

// Product detail (full product information for product page)
export interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: ProductImage[];
  category: ProductCategory | null;
  material: string | null;
  color: string | null;
  dimensions: string | null;
  stock: number;
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
