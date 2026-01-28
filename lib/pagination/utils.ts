/**
 * Pagination utility functions
 */

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./constants";
import type { PaginationParams, PaginationMeta } from "./types";

/**
 * Validate and normalize pagination parameters
 */
export function validatePaginationParams(
  page?: string | number,
  pageSize?: string | number,
): PaginationParams {
  let normalizedPage = parseInt(String(page || DEFAULT_PAGE), 10);
  let normalizedPageSize = parseInt(String(pageSize || DEFAULT_PAGE_SIZE), 10);

  // Ensure page is at least 1
  if (isNaN(normalizedPage) || normalizedPage < 1) {
    normalizedPage = DEFAULT_PAGE;
  }

  // Ensure pageSize is valid
  if (isNaN(normalizedPageSize) || normalizedPageSize < 1) {
    normalizedPageSize = DEFAULT_PAGE_SIZE;
  }

  // Cap pageSize to prevent excessive data fetching
  if (normalizedPageSize > MAX_PAGE_SIZE) {
    normalizedPageSize = MAX_PAGE_SIZE;
  }

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
  };
}

/**
 * Calculate offset for GROQ query (for skip())
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Generate pagination metadata
 */
export function generatePaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Build query string for pagination links
 */
export function buildPaginationQueryString(
  currentParams: Record<string, string | number | boolean | undefined>,
  page: number,
  pageSize?: number,
): string {
  const params = new URLSearchParams();

  // Add all current params
  Object.entries(currentParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  // Set pagination params
  params.set("page", String(page));
  if (pageSize) {
    params.set("pageSize", String(pageSize));
  }

  return params.toString();
}

/**
 * Generate GROQ slice syntax for pagination
 * Usage: `*[condition][offset...limit]`
 */
export function generateGroqSlice(page: number, pageSize: number): string {
  const offset = calculateOffset(page, pageSize);
  const limit = offset + pageSize;
  return `[${offset}...${limit}]`;
}

/**
 * Get page range for pagination display (e.g., showing pages 1-5 of 50)
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  windowSize: number = 5,
): number[] {
  const halfWindow = Math.floor(windowSize / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, startPage + windowSize - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
}
