import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY,
  PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  PAGINATED_FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  PAGINATED_FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  FEATURED_PRODUCTS_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { CategoryTiles } from "@/components/app/CategoryTiles";
import { ProductSection } from "@/components/app/ProductSection";
import { ProductPagination } from "@/components/app/ProductPagination";
import { validatePaginationParams, calculateOffset, generatePaginationMeta } from "@/lib/pagination/utils";
import { PaginationInfo } from "@/components/ui/pagination";

// Revalidate every 60 seconds for fresh data
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Pagination parameters
  const { page, pageSize } = validatePaginationParams(params.page, params.pageSize);
  const offset = calculateOffset(page, pageSize);
  const limit = offset + pageSize;

  // Filter parameters
  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    // If searching and sort is relevance, use relevance query
    if (searchQuery && sort === "relevance") {
      return PAGINATED_FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return PAGINATED_FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return PAGINATED_FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return PAGINATED_FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return PAGINATED_FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch paginated products with filters (server-side via GROQ)
  const { data: paginatedData } = await sanityFetch({
    query: getQuery(),
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

  const products = paginatedData?.results || [];
  const total = paginatedData?.total || 0;
  const paginationMeta = generatePaginationMeta(page, pageSize, total);

  // Fetch categories for filter sidebar
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch featured products for carousel
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}

      {/* Page Banner */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shop {categorySlug ? categorySlug : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Premium furniture for your home
          </p>
        </div>

        {/* Category Tiles - Full width */}
        <div className="mt-6">
          <CategoryTiles
            categories={categories}
            activeCategory={categorySlug || undefined}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="products-section">
        <ProductSection
          categories={categories}
          products={products}
          searchQuery={searchQuery}
        />

        {/* Pagination Info */}
        {total > 0 && (
          <div className="mt-8 space-y-4">
            <PaginationInfo
              currentPage={page}
              pageSize={pageSize}
              total={total}
              className="text-center"
            />

            {/* Pagination Controls */}
            <ProductPagination
              currentPage={page}
              totalPages={paginationMeta.totalPages}
              searchParams={params}
            />
          </div>
        )}

        {/* No Results Message */}
        {total === 0 && (
          <div className="mt-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No products found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}