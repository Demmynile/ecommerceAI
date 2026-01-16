"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { validatePaginationParams, buildPaginationQueryString } from "@/lib/pagination/utils";
import type { PaginationParams } from "@/lib/pagination/types";

/**
 * Hook for managing pagination state and URL parameters
 * Extracts pagination info from URL and provides utilities for navigation
 */
export function usePagination() {
  const searchParams = useSearchParams();

  // Extract pagination params from URL
  const { page, pageSize } = validatePaginationParams(
    searchParams.get("page") ?? undefined,
    searchParams.get("pageSize") ?? undefined
  );

  // Build query string for pagination links
  const buildPaginationLink = useCallback(
    (newPage: number, newPageSize?: number) => {
      const params: Record<string, string | undefined> = {};

      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "pageSize") {
          params[key] = value;
        }
      });

      return buildPaginationQueryString(params, newPage, newPageSize);
    },
    [searchParams]
  );

  return {
    page,
    pageSize,
    buildPaginationLink,
  };
}

/**
 * Hook to extract all filter parameters and preserve them during pagination
 */
export function useFilterParams() {
  const searchParams = useSearchParams();

  const filterParams = useMemo(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (value && !["page", "pageSize"].includes(key)) {
        params[key] = value;
      }
    });

    return params;
  }, [searchParams]);

  return filterParams;
}

/**
 * Hook for tracking pagination state with filters
 */
export function usePaginationWithFilters() {
  const { page, pageSize, buildPaginationLink } = usePagination();
  const filterParams = useFilterParams();

  const goToPage = useCallback(
    (newPage: number) => {
      const queryString = buildPaginationLink(newPage, pageSize);
      return `?${queryString}`;
    },
    [buildPaginationLink, pageSize]
  );

  const goToFirstPage = useCallback(() => {
    const queryString = buildPaginationLink(1, pageSize);
    return `?${queryString}`;
  }, [buildPaginationLink, pageSize]);

  const goToLastPage = useCallback(
    (totalPages: number) => {
      const queryString = buildPaginationLink(totalPages, pageSize);
      return `?${queryString}`;
    },
    [buildPaginationLink, pageSize]
  );

  return {
    page,
    pageSize,
    filterParams,
    goToPage,
    goToFirstPage,
    goToLastPage,
  };
}
