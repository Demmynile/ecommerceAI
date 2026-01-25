/**
 * Type definitions for category queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/categories.ts
 */

export interface CategoryListItem {
  _id: string;
  title: string;
  slug: string;
  image: {
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
  } | null;
}

export type CategoryList = CategoryListItem[];
