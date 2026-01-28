// ============================================
// Product Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const COUNTRIES = [
  { value: "india", label: "India" },
  { value: "italy", label: "Italy" },
  { value: "turkey", label: "Turkey" },
  { value: "egypt", label: "Egypt" },
  { value: "dubai", label: "Dubai" },
  { value: "usa", label: "USA" },
] as const;

export const CARATS = [
  { value: "14k", label: "14K" },
  { value: "18k", label: "18K" },
  { value: "21k", label: "21K" },
  { value: "22k", label: "22K" },
  { value: "24k", label: "24K" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "relevance", label: "Relevance" },
] as const;

// Type exports
export type CountryValue = (typeof COUNTRIES)[number]["value"];
export type CaratValue = (typeof CARATS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Countries formatted for Sanity schema options.list */
export const COUNTRIES_SANITY_LIST = COUNTRIES.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Carats formatted for Sanity schema options.list */
export const CARATS_SANITY_LIST = CARATS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Country values array for zod enums or validation */
export const COUNTRY_VALUES = COUNTRIES.map((c) => c.value) as [
  CountryValue,
  ...CountryValue[],
];

/** Carat values array for zod enums or validation */
export const CARAT_VALUES = CARATS.map((m) => m.value) as [
  CaratValue,
  ...CaratValue[],
];
