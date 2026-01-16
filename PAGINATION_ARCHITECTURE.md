# Pagination Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│  /?q=sofa&page=2&pageSize=12&sort=price_asc                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js App Router - Server Component              │
│              app/(app)/page.tsx                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ┌─────────┐    ┌──────────┐    ┌──────────────┐
   │ Extract │    │ Validate │    │  Calculate  │
   │ Params  │───▶│ Pagination   │──▶│   Offset   │
   └─────────┘    │ Params   │    │   & Limit   │
                  └──────────┘    └──────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐  ┌──────────────┐ ┌──────────────┐
   │Search   │  │Category      │ │Price Range   │
   │Query    │  │Filter        │ │Filter        │
   └────┬────┘  └────┬─────────┘ └────┬─────────┘
        └─────────────┼────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  GROQ Query with Filters    │
        │  + Pagination (offset/limit)│
        └────────────┬────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────┐
        │     Sanity Content Lake          │
        │  Returns: { total, results }    │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────┐
        │   Generate Pagination Metadata   │
        │ (totalPages, hasNext, hasPrev)  │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────┐
        │  Render with Pagination UI       │
        │  - Product Grid                  │
        │  - Pagination Controls           │
        │  - Result Count Info             │
        └────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HTML Response to Browser                       │
│         With Page Links: /?q=sofa&page=3&pageSize=12           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
URL Parameters
    │
    ├─ q (search query)
    ├─ category
    ├─ sort
    ├─ page ◄──── Pagination
    └─ pageSize ◄─ Pagination
         │
         ▼
validatePaginationParams()
    │
    ├─ Normalize to integers
    ├─ Validate bounds
    └─ Return: { page, pageSize }
         │
         ▼
calculateOffset()
    │
    └─ (page - 1) * pageSize = offset
         │
         ▼
SANITY QUERY
    │
    ├─ Filter by search/category/price
    ├─ count(*[...]) = total count
    ├─ [offset...limit] = paginated slice
    └─ Return: { total, results }
         │
         ▼
generatePaginationMeta()
    │
    ├─ totalPages = ceil(total / pageSize)
    ├─ hasNextPage = page < totalPages
    ├─ hasPrevPage = page > 1
    └─ Return: Complete pagination metadata
         │
         ▼
Render Component
    │
    ├─ <ProductGrid products={results} />
    ├─ <Pagination ... />
    └─ <PaginationInfo ... />
```

## Component Hierarchy

```
HomePage (Server Component)
│
├─ Props: searchParams (includes page, pageSize)
│
├─ ▶ validatePaginationParams() ─► { page, pageSize }
├─ ▶ calculateOffset() ────────► offset
├─ ▶ sanityFetch(PAGINATED_QUERY) ──► { total, results }
├─ ▶ generatePaginationMeta() ──► { totalPages, ... }
│
└─ Renders:
   │
   ├─ FeaturedCarousel
   ├─ CategoryTiles
   ├─ ProductSection
   │  └─ ProductGrid (with results)
   │
   ├─ PaginationInfo (Client Component)
   │  └─ Displays: "Showing 25-36 of 145 results"
   │
   └─ ClientPagination (Client Component)
      └─ Pagination Component
         ├─ Previous button
         ├─ Page number buttons
         ├─ Page range (1, 2, 3... 5)
         └─ Next button
```

## Pagination Component Flow

```
<Pagination>
  │
  ├─ currentPage = 2
  ├─ totalPages = 10
  │
  └─ Calculate Page Range
     │
     ├─ getPageRange(2, 10, 5)
     │
     └─ Returns: [1, 2, 3, 4, 5]
        │
        └─ Render Buttons
           │
           ├─ ◄ Previous (onClick: page 1)
           ├─ [1] (style: outline)
           ├─ [2] (style: primary) ◄── Active
           ├─ [3] (style: outline)
           ├─ [4] (style: outline)
           ├─ [5] (style: outline)
           ├─ ... (more page indicator)
           ├─ [10] (style: outline)
           └─ Next ► (onClick: page 3)
```

## State Management Flow

```
URL Changes
    │
    ▼
searchParams Updated
    │
    ▼
validatePaginationParams()
    │
    ▼
Fetch with new offset/limit
    │
    ▼
Render new results
    │
    ▼
User sees page 2 products
    │
    ▼
User clicks "Next"
    │
    ▼
onClick → buildPaginationQueryString(newPage)
    │
    ▼
window.location.href = new URL
    │
    └──► (cycle repeats from top)
```

## Query Execution Timeline

```
Time ──────────────────────────────────────────────────────►
     │
     ├─ User loads /?page=2&pageSize=12
     │
     ├─ Server extracts searchParams
     │
     ├─ validatePaginationParams("2", "12")
     │  └─ Returns: { page: 2, pageSize: 12 }
     │
     ├─ calculateOffset(2, 12)
     │  └─ Returns: 12
     │
     ├─ sanityFetch(PAGINATED_QUERY, {
     │    offset: 12,
     │    limit: 24,
     │    searchQuery: "",
     │    categorySlug: "",
     │    ...
     │  })
     │
     ├─ Sanity executes GROQ:
     │  │ count(*[_type == "product" && ...])  → total: 145
     │  │ *[_type == "product" && ...][12...24]  → results: [...]
     │  │
     │  └─ Returns: { total: 145, results: [...12 items...] }
     │
     ├─ generatePaginationMeta(2, 12, 145)
     │  └─ Returns: {
     │       page: 2,
     │       pageSize: 12,
     │       total: 145,
     │       totalPages: 13,
     │       hasNextPage: true,
     │       hasPrevPage: true
     │     }
     │
     └─ Render homepage with pagination controls
```

## URL Parameter Evolution

```
Initial Load:
  /?page=1
         │
         ├─ User clicks Next
         │
         ▼
  /?page=2
         │
         ├─ User adds search filter
         │
         ▼
  /?q=sofa&page=2
         │
         ├─ User changes sort
         │
         ▼
  /?q=sofa&sort=price_asc&page=2
         │
         ├─ User clicks pagination page 3
         │
         ▼
  /?q=sofa&sort=price_asc&page=3
         │
         ├─ All filters are preserved!
         │
         ▼
  Results show products 25-36 of search results
```

## Hook Flow - usePagination()

```
"use client" component
    │
    ▼
const { page, pageSize, buildPaginationLink } = usePagination()
    │
    ├─ useSearchParams() ◄── Get current URL params
    │
    ├─ validatePaginationParams(
    │    searchParams.get("page"),
    │    searchParams.get("pageSize")
    │  )
    │
    └─ buildPaginationLink(newPage, newPageSize)
       │
       └─ Preserves all non-pagination URL params
          │
          └─ Returns query string for new page
```

## Performance Characteristics

```
Server Component Processing:
├─ Validate params: O(1)
├─ Calculate offset: O(1)
├─ GROQ count + slice: O(n) where n = filtered products
├─ Generate metadata: O(1)
└─ Total: O(n) - dominated by Sanity query

Network Transfer:
├─ Request: ~100 bytes (URL params)
├─ Response: ~50KB (HTML + paginated results)
└─ Total per page load: ~50KB

Database Query (Sanity):
├─ count(*[filters]): Indexed scan
├─ [offset...limit]: Direct slice, no N+1
└─ Total: Single optimized query
```

## Error Handling Flow

```
Invalid page=0
    │
    ▼
validatePaginationParams("0", "12")
    │
    ├─ page < 1? YES
    │
    └─ Return { page: 1, pageSize: 12 }
       │
       └─ Reset to page 1
          │
          └─ Load valid results

Invalid pageSize=10000
    │
    ▼
validatePaginationParams("2", "10000")
    │
    ├─ pageSize > MAX_PAGE_SIZE? YES
    │
    └─ Return { page: 2, pageSize: 100 }
       │
       └─ Cap to maximum allowed
          │
          └─ Load limited results
```

---

**Key Takeaways:**

1. ✅ URL is the single source of truth
2. ✅ All pagination logic on server (fast)
3. ✅ Filters automatically preserved
4. ✅ Type-safe throughout pipeline
5. ✅ No client-side data queries needed
6. ✅ Scales efficiently with Sanity
