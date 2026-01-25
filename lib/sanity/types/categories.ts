/**
 * Type definitions for category queries
 * These types match the structure returned by GROQ queries in lib/sanity/queries/categories.ts
 */

import type { SanityImageHotspot } from "@/sanity.types";

export interface CategoryListItem {
  _id: string;
  title: string | null;
  slug: string | null;
  image: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
    hotspot: SanityImageHotspot | null;
  } | null;
}

export type CategoryList = CategoryListItem[];
