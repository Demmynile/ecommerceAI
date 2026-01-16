# Pagination Implementation Guide

## Overview

This document describes the pagination system implemented in the eCommerceAI app, which integrates seamlessly with Sanity CMS for server-side filtering, sorting, and pagination.

## File Structure

```
lib/pagination/
├── constants.ts        # Pagination constants (page size, limits)
├── types.ts           # TypeScript interfaces and types
├── utils.ts           # Utility functions for pagination logic
├── queries.ts         # Sanity query helpers
└── hooks.ts           # Custom React hooks for client-side state

components/
├── ui/pagination.tsx           # Basic pagination component
└── app/AdvancedPagination.tsx  # Advanced pagination with page size control
```

## Key Components

### 1. **Pagination Constants** (`lib/pagination/constants.ts`)

```typescript
DEFAULT_PAGE = 1              // Starting page number
DEFAULT_PAGE_SIZE = 12        // Products per page
MAX_PAGE_SIZE = 100           // Maximum allowed page size
PAGE_SIZE_OPTIONS = [12, 24, 48]  // User selectable options
```

### 2. **Pagination Types** (`lib/pagination/types.ts`)

- `PaginationParams`: Page and pageSize numbers
- `PaginationMeta`: Complete pagination metadata (total, totalPages, hasNextPage, etc.)
- `PaginatedResponse<T>`: Response structure with data and metadata
- `PaginationState`: Client-side pagination state

### 3. **Utility Functions** (`lib/pagination/utils.ts`)

#### Core Functions:

- `validatePaginationParams()` - Validates and normalizes page/pageSize from URL
- `calculateOffset()` - Converts page number to GROQ offset
- `generatePaginationMeta()` - Creates pagination metadata object
- `buildPaginationQueryString()` - Builds URL query strings preserving filters
- `generateGroqSlice()` - Creates GROQ slice syntax `[offset...limit]`
- `getPageRange()` - Generates array of page numbers for UI display

### 4. **Sanity Queries** (`lib/sanity/queries/products.ts`)

#### New Paginated Queries:

```typescript
// All return { total, results }
PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY
PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY
PAGINATED_FILTER_PRODUCTS_BY_PRICE_DESC_QUERY
PAGINATED_FILTER_PRODUCTS_BY_RELEVANCE_QUERY
```

**Query Parameters:**
- `searchQuery` - Search term
- `categorySlug` - Category filter
- `color` - Color filter
- `material` - Material filter
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Stock availability
- `offset` - GROQ offset (calculated from page)
- `limit` - GROQ limit (offset + pageSize)

### 5. **React Hooks** (`lib/pagination/hooks.ts`)

#### `usePagination()`
Extracts pagination state from URL and provides utilities:
```typescript
const { page, pageSize, buildPaginationLink } = usePagination();
```

#### `useFilterParams()`
Extracts all filter parameters from URL:
```typescript
const filterParams = useFilterParams();
// { q, category, color, material, minPrice, maxPrice, sort, inStock }
```

#### `usePaginationWithFilters()`
Combined hook with navigation methods:
```typescript
const { page, pageSize, filterParams, goToPage, goToFirstPage, goToLastPage } = 
  usePaginationWithFilters();
```

### 6. **UI Components**

#### `Pagination` Component (`components/ui/pagination.tsx`)
Basic pagination controls:
- Previous/Next buttons
- Page number buttons with smart range display
- Loading state support
- Accessible with aria-labels

```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

#### `PaginationInfo` Component
Displays "Showing X to Y of Z results":
```tsx
<PaginationInfo
  currentPage={page}
  pageSize={pageSize}
  total={total}
/>
```

#### `AdvancedPagination` Component (`components/app/AdvancedPagination.tsx`)
Full-featured pagination UI:
- Page size selector
- Jump-to-page input
- Page information
- Keyboard navigation ready

```tsx
<AdvancedPagination
  currentPage={page}
  totalPages={totalPages}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  showPageSize={true}
  showJumpToPage={true}
/>
```

## Integration Example

### In Server Component (app/(app)/page.tsx)

```typescript
// 1. Extract and validate pagination params
const { page, pageSize } = validatePaginationParams(params.page, params.pageSize);
const offset = calculateOffset(page, pageSize);
const limit = offset + pageSize;

// 2. Fetch with Sanity
const { data: paginatedData } = await sanityFetch({
  query: PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY,
  params: {
    searchQuery,
    categorySlug,
    color,
    material,
    minPrice,
    maxPrice,
    inStock,
    offset,
    limit,
  },
});

// 3. Extract results and generate metadata
const products = paginatedData?.results || [];
const total = paginatedData?.total || 0;
const paginationMeta = generatePaginationMeta(page, pageSize, total);

// 4. Use in JSX
return (
  <>
    <ProductList products={products} />
    <Pagination
      currentPage={page}
      totalPages={paginationMeta.totalPages}
      onPageChange={handlePageChange}
    />
    <PaginationInfo
      currentPage={page}
      pageSize={pageSize}
      total={total}
    />
  </>
);
```

## URL Query String Format

Pagination parameters are preserved in URL with all filters:

```
/?q=furniture&category=sofas&sort=price_asc&page=2&pageSize=24
                                              ↑       ↑
                                          Pagination params
```

## Features

✅ **Server-Side Pagination** - GROQ handles pagination efficiently
✅ **Preserved Filters** - All search/filter params maintained during pagination
✅ **Type-Safe** - Full TypeScript support
✅ **Configurable** - Easy to adjust page sizes and defaults
✅ **Accessible** - ARIA labels and keyboard navigation ready
✅ **Responsive** - Mobile-friendly pagination UI
✅ **Performance** - Minimal data fetching, smart query design

## Usage in Other Pages

To add pagination to other product listings:

```typescript
import { validatePaginationParams, calculateOffset, generatePaginationMeta } from "@/lib/pagination/utils";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

// In your server component:
const { page, pageSize } = validatePaginationParams(searchParams.page, searchParams.pageSize);
const offset = calculateOffset(page, pageSize);

// Fetch with pagination params...
const paginationMeta = generatePaginationMeta(page, pageSize, total);

// In JSX:
<Pagination
  currentPage={page}
  totalPages={paginationMeta.totalPages}
  onPageChange={handlePageChange}
/>
```

## Customization

### Change Default Page Size

Edit `lib/pagination/constants.ts`:
```typescript
export const DEFAULT_PAGE_SIZE = 24; // Was 12
```

### Change Page Size Options

```typescript
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
```

### Customize Pagination UI

The `Pagination` component is unstyled and can be customized using Tailwind classes. The `AdvancedPagination` component offers more features.

## Performance Optimization

1. **Server-Side Pagination** - Uses GROQ `count()` + `[offset...limit]` for efficient data fetching
2. **Query Reuse** - Filter conditions defined once, used in multiple queries
3. **Minimal Props** - Only essential data passed to components
4. **URL-Based State** - Pagination state persists across page reloads and shares via URL

## Error Handling

- Invalid page numbers default to page 1
- Invalid page sizes default to 12
- Page size capped at MAX_PAGE_SIZE (100)
- Non-numeric params handled gracefully

## Testing Pagination

1. Add many products to Sanity (or use sample data)
2. Visit homepage with pagination: `/?page=2&pageSize=12`
3. Test filter + pagination: `/?q=sofa&sort=price_asc&page=1`
4. Test page size change: `/?pageSize=24`
5. Verify metadata displays correctly

## Future Enhancements

- [ ] Cursor-based pagination for better performance at scale
- [ ] Remember user's pageSize preference (localStorage)
- [ ] Infinite scroll option
- [ ] SEL canonicalization for search engines
- [ ] Analytics tracking for page navigation
