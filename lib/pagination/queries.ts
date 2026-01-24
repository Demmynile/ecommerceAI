/**
 * Pagination query helpers for Sanity
 * These functions modify existing queries to include pagination
 */

import { defineQuery } from "next-sanity";

/**
 * Add pagination to a GROQ filter query
 * Includes total count and paginated results
 * 
 * Usage:
 * const query = createPaginatedQuery(
 *   '*[_type == "product"]',
 *   'product'
 * );
 */
export function createPaginatedQuery(
  baseFilter: string,
  offset: number,
  limit: number
): string {
  // Return both total count and paginated results
  return `{
    "total": count(*[${baseFilter}]),
    "results": *[${baseFilter}][${offset}...${limit}]
  }`;
}

/**
 * Create a paginated query for filtered products
 * Returns total count and paginated results with full product data
 */
export function createPaginatedProductQuery(
  filterConditions: string,
  sortOrder: string,
  offset: number,
  limit: number,
  projection: string
): string {
  return `{
    "total": count(*[${filterConditions}]),
    "results": *[${filterConditions}] | ${sortOrder} ${projection}[${offset}...${limit}]
  }`;
}

/**
 * Create a counted query that returns both total and paginated items
 * This is more efficient than querying twice
 */
export function createCountedAndPaginatedQuery(
  baseFilter: string,
  orderBy: string,
  projection: string,
  offset: number,
  limit: number
): string {
  return `{
    "total": count(*[${baseFilter}]),
    "results": *[${baseFilter}] | ${orderBy} ${projection}[${offset}...${limit}]
  }`;
}

// ============================================
// Paginated Query Fragments
// ============================================

/**
 * Product projection for paginated results
 */
export const PAGINATED_PRODUCT_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  price,
  "images": images[0...4]{
    _key,
    asset->{
      _id,
      url
    }
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  country,
  carat,
  stock
}`;

/**
 * Filter conditions with pagination support variables
 */
export const PAGINATED_PRODUCT_FILTER_CONDITIONS = `
  _type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($country == "" || country == $country)
  && ($carat == "" || carat == $carat)
  && ($minPrice == 0 || price >= $minPrice)
  && ($maxPrice == 0 || price <= $maxPrice)
  && ($searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*")
  && ($inStock == false || stock > 0)
`;
