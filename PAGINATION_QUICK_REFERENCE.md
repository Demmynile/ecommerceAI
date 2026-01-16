# Pagination Quick Reference

## Quick Start

### In Server Component

```typescript
import { validatePaginationParams, calculateOffset, generatePaginationMeta } from "@/lib/pagination";
import { PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY } from "@/lib/sanity/queries/products";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

export default async function Page({ searchParams }: Props) {
  // 1. Validate pagination from URL
  const { page, pageSize } = validatePaginationParams(
    searchParams.page,
    searchParams.pageSize
  );
  
  // 2. Calculate GROQ offset/limit
  const offset = calculateOffset(page, pageSize);
  
  // 3. Fetch with pagination
  const { data: paginatedData } = await sanityFetch({
    query: PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY,
    params: {
      searchQuery,
      offset,
      limit: offset + pageSize,
      // ... other params
    },
  });
  
  // 4. Generate metadata
  const total = paginatedData?.total || 0;
  const paginationMeta = generatePaginationMeta(page, pageSize, total);
  
  // 5. Use in JSX
  return (
    <>
      <ProductGrid products={paginatedData.results} />
      <Pagination
        currentPage={page}
        totalPages={paginationMeta.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
```

## Key Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `validatePaginationParams(page, pageSize)` | Validate & normalize pagination params | `{ page, pageSize }` |
| `calculateOffset(page, pageSize)` | Convert page to GROQ offset | `number` |
| `generatePaginationMeta(page, pageSize, total)` | Create pagination metadata | `PaginationMeta` |
| `getPageRange(page, total, window)` | Get visible page numbers | `number[]` |
| `buildPaginationQueryString(params, page)` | Build pagination URL | `string` |

## Components

### Basic Pagination
```tsx
import { Pagination } from "@/components/ui/pagination";

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(page) => navigate(`?page=${page}`)}
/>
```

### With Info Display
```tsx
import { PaginationInfo } from "@/components/ui/pagination";

<PaginationInfo
  currentPage={page}
  pageSize={pageSize}
  total={total}
/>
```

### Advanced Pagination
```tsx
import { AdvancedPagination } from "@/components/app/AdvancedPagination";

<AdvancedPagination
  currentPage={page}
  totalPages={totalPages}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  showPageSize
  showJumpToPage
/>
```

## Client-Side Hooks

### usePagination
```tsx
"use client";
import { usePagination } from "@/lib/pagination";

export function MyComponent() {
  const { page, pageSize, buildPaginationLink } = usePagination();
  
  const nextPageUrl = `?${buildPaginationLink(page + 1)}`;
  // ...
}
```

### usePaginationWithFilters
```tsx
const { page, filterParams, goToPage, goToFirstPage } = usePaginationWithFilters();

// Navigate to page 3
window.location.href = goToPage(3);
```

## Sanity Queries

All paginated queries require these params:
- `offset` - Calculated from page (see calculateOffset)
- `limit` - offset + pageSize
- `searchQuery` - Search term (or empty string)
- `categorySlug` - Category filter (or empty string)
- `color` - Color filter (or empty string)
- `material` - Material filter (or empty string)
- `minPrice` - Min price or 0
- `maxPrice` - Max price or 0
- `inStock` - Boolean for stock filter

```typescript
const { data } = await sanityFetch({
  query: PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  params: {
    offset: 0,        // (page - 1) * pageSize
    limit: 12,        // offset + pageSize
    searchQuery: "",
    categorySlug: "sofas",
    color: "",
    material: "",
    minPrice: 0,
    maxPrice: 0,
    inStock: false,
  },
});

// Returns:
// {
//   total: 145,
//   results: [{ _id, name, price, ... }, ...]
// }
```

## Pagination in URLs

```
Base URL: /?q=sofa&sort=price_asc

With pagination:
/?q=sofa&sort=price_asc&page=2        (default pageSize=12)
/?q=sofa&sort=price_asc&page=1&pageSize=24
/?q=sofa&category=sofas&page=3&pageSize=12
```

All existing filters are preserved when changing pages.

## Common Patterns

### Navigate Programmatically
```typescript
const params = new URLSearchParams(searchParams);
params.set("page", String(newPage));
window.location.href = `?${params.toString()}`;
```

### Preserve Filters
```typescript
// buildPaginationQueryString automatically preserves filters
const newUrl = buildPaginationQueryString(
  { q: "sofa", sort: "price_asc" },
  2,  // new page
  24  // new pageSize
);
```

### Check if More Pages
```typescript
const hasNextPage = paginationMeta.hasNextPage;
const hasPrevPage = paginationMeta.hasPrevPage;
```

## Configuration

Edit `lib/pagination/constants.ts`:

```typescript
// Change default page size
export const DEFAULT_PAGE_SIZE = 24;

// Change available page sizes
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// Change max allowed page size
export const MAX_PAGE_SIZE = 200;
```

## Troubleshooting

**Q: Page param not working?**
A: Make sure to use `validatePaginationParams()` - it normalizes string inputs.

**Q: Filters not persisting?**
A: Use `buildPaginationQueryString()` when building pagination links, or manually preserve all URL params.

**Q: Pagination not showing?**
A: Ensure you're using a PAGINATED_* query that returns `{ total, results }`.

**Q: Type errors?**
A: Import types from `@/lib/pagination/types` and use them for component props.
