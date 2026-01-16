# Pagination Implementation Examples

This document provides complete, copy-paste ready examples for implementing pagination throughout your app.

## Example 1: Basic Product Listing with Pagination

### File: `app/products/page.tsx`

```typescript
import { sanityFetch } from "@/sanity/lib/live";
import {
  validatePaginationParams,
  calculateOffset,
  generatePaginationMeta,
} from "@/lib/pagination";
import { PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY } from "@/lib/sanity/queries/products";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/app/ProductGrid";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 1. Validate pagination
  const { page, pageSize } = validatePaginationParams(params.page, params.pageSize);
  const offset = calculateOffset(page, pageSize);

  // 2. Fetch paginated products
  const { data: paginatedData } = await sanityFetch({
    query: PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY,
    params: {
      offset,
      limit: offset + pageSize,
      searchQuery: "",
      categorySlug: "",
      color: "",
      material: "",
      minPrice: 0,
      maxPrice: 0,
      inStock: false,
    },
  });

  // 3. Generate metadata
  const products = paginatedData?.results || [];
  const total = paginatedData?.total || 0;
  const meta = generatePaginationMeta(page, pageSize, total);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-gray-600">Showing all available items</p>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />

          <div className="space-y-4 border-t pt-8">
            <PaginationInfo
              currentPage={page}
              pageSize={pageSize}
              total={total}
              className="text-center"
            />
            <ClientPagination
              currentPage={page}
              totalPages={meta.totalPages}
            />
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}

function ClientPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    window.location.href = `?${params.toString()}`;
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className="justify-center"
    />
  );
}
```

## Example 2: Filtered Products with Pagination

### File: `app/search/page.tsx`

```typescript
import { sanityFetch } from "@/sanity/lib/live";
import {
  validatePaginationParams,
  calculateOffset,
  generatePaginationMeta,
} from "@/lib/pagination";
import { PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY } from "@/lib/sanity/queries/products";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/app/ProductGrid";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Extract all parameters
  const searchQuery = params.q || "";
  const category = params.category || "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;

  // Pagination
  const { page, pageSize } = validatePaginationParams(params.page, params.pageSize);
  const offset = calculateOffset(page, pageSize);

  // Fetch with filters
  const { data: paginatedData } = await sanityFetch({
    query: PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
    params: {
      searchQuery,
      categorySlug: category,
      color: "",
      material: "",
      minPrice,
      maxPrice,
      inStock: false,
      offset,
      limit: offset + pageSize,
    },
  });

  const products = paginatedData?.results || [];
  const total = paginatedData?.total || 0;
  const meta = generatePaginationMeta(page, pageSize, total);

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        {searchQuery && (
          <p className="text-gray-600">
            Results for "{searchQuery}" {category && `in ${category}`}
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />

          <div className="space-y-4 border-t pt-8">
            <PaginationInfo
              currentPage={page}
              pageSize={pageSize}
              total={total}
              className="text-center"
            />
            <SearchPagination
              currentPage={page}
              totalPages={meta.totalPages}
              searchParams={params}
            />
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No products found matching your search</p>
        </div>
      )}
    </div>
  );
}

function SearchPagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();

    // Preserve all search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !["page", "pageSize"].includes(key)) {
        params.append(key, value);
      }
    });

    params.set("page", String(newPage));
    window.location.href = `?${params.toString()}`;
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className="justify-center"
    />
  );
}
```

## Example 3: Using Advanced Pagination Component

### File: `app/store/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { AdvancedPagination } from "@/components/app/AdvancedPagination";
import { usePaginationWithFilters } from "@/lib/pagination/hooks";

export default function StorePage() {
  const { page, pageSize, goToPage } = usePaginationWithFilters();
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    // Navigate with the generated URL
    const url = goToPage(newPage);
    window.location.href = url;
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page
    params.set("pageSize", String(newPageSize));
    window.location.href = `?${params.toString()}`;
  };

  return (
    <div>
      <h1>Store</h1>
      
      {/* Your product grid here */}

      <AdvancedPagination
        currentPage={page}
        totalPages={10}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
        showPageSize
        showJumpToPage
      />
    </div>
  );
}
```

## Example 4: API Route with Pagination

### File: `app/api/products/route.ts`

```typescript
import { sanityFetch } from "@/sanity/lib/live";
import {
  validatePaginationParams,
  calculateOffset,
  generatePaginationMeta,
} from "@/lib/pagination";
import { PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY } from "@/lib/sanity/queries/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract parameters
    const searchQuery = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    // Pagination
    const { page, pageSize } = validatePaginationParams(
      searchParams.get("page"),
      searchParams.get("pageSize")
    );
    const offset = calculateOffset(page, pageSize);

    // Fetch from Sanity
    const { data: paginatedData } = await sanityFetch({
      query: PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY,
      params: {
        searchQuery,
        categorySlug: category,
        color: "",
        material: "",
        minPrice: 0,
        maxPrice: 0,
        inStock: false,
        offset,
        limit: offset + pageSize,
      },
    });

    const products = paginatedData?.results || [];
    const total = paginatedData?.total || 0;
    const meta = generatePaginationMeta(page, pageSize, total);

    return NextResponse.json({
      data: products,
      pagination: meta,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

## Example 5: Infinite Scroll Implementation

### File: `components/InfiniteProductScroll.tsx`

```typescript
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePagination } from "@/lib/pagination/hooks";
import { ProductCard } from "./ProductCard";

interface InfiniteProductScrollProps {
  initialProducts: any[];
  initialTotal: number;
  pageSize: number;
}

export function InfiniteProductScroll({
  initialProducts,
  initialTotal,
  pageSize,
}: InfiniteProductScrollProps) {
  const { page, buildPaginationLink } = usePagination();
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const hasMore = products.length < initialTotal;
  const currentPage = Math.ceil(products.length / pageSize);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const queryString = buildPaginationLink(nextPage, pageSize);
      const response = await fetch(`/api/products?${queryString}`);
      const data = await response.json();

      setProducts((prev) => [...prev, ...data.data]);
    } catch (error) {
      console.error("Failed to load more products", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, buildPaginationLink, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerTarget}
          className="mt-8 flex justify-center py-4"
        >
          {isLoading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          ) : (
            <p className="text-gray-500">Scroll for more...</p>
          )}
        </div>
      )}
    </>
  );
}
```

## Example 6: Custom Pagination Hook

### File: `hooks/useProductPagination.ts`

```typescript
"use client";

import { usePaginationWithFilters } from "@/lib/pagination";

export function useProductPagination() {
  const { page, pageSize, goToPage, filterParams } = usePaginationWithFilters();

  return {
    page,
    pageSize,
    searchQuery: filterParams.q || "",
    category: filterParams.category || "",
    sort: filterParams.sort || "name",
    hasFilters: Object.keys(filterParams).length > 0,
    goToPage,
    
    // Convenience methods
    nextPage: () => goToPage(page + 1),
    prevPage: () => goToPage(page - 1),
    resetPage: () => goToPage(1),
  };
}
```

## Testing Pagination

### Manual Testing Checklist

- [ ] Navigate to page 2: `/?page=2`
- [ ] Change page size: `/?page=1&pageSize=24`
- [ ] Combine with filters: `/?q=sofa&page=2&pageSize=12`
- [ ] Check pagination info displays correctly
- [ ] Verify "Previous" disabled on page 1
- [ ] Verify "Next" disabled on last page
- [ ] Test jump to page functionality
- [ ] Verify filters persist when paginating
- [ ] Test on mobile (responsive pagination)

### Unit Test Example

```typescript
import { validatePaginationParams, calculateOffset, generatePaginationMeta } from "@/lib/pagination";

describe("Pagination Utilities", () => {
  test("validatePaginationParams with defaults", () => {
    const result = validatePaginationParams(undefined, undefined);
    expect(result).toEqual({ page: 1, pageSize: 12 });
  });

  test("validatePaginationParams with valid inputs", () => {
    const result = validatePaginationParams("2", "24");
    expect(result).toEqual({ page: 2, pageSize: 24 });
  });

  test("calculateOffset", () => {
    expect(calculateOffset(1, 12)).toBe(0);
    expect(calculateOffset(2, 12)).toBe(12);
    expect(calculateOffset(3, 24)).toBe(48);
  });

  test("generatePaginationMeta", () => {
    const meta = generatePaginationMeta(2, 12, 100);
    expect(meta).toEqual({
      page: 2,
      pageSize: 12,
      total: 100,
      totalPages: 9,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });
});
```

## Deployment Notes

- Pagination state is entirely URL-based ✓
- No client-side database queries needed ✓
- All pagination logic on server ✓
- SEO friendly (page param in URL) ✓
- Shareable pagination links ✓
- Works with ISR/Revalidation ✓
