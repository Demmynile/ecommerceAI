import { tool } from "ai";
import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/live";
import { AI_SEARCH_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import { formatPrice } from "@/lib/utils";
import { getStockStatus, getStockMessage } from "@/lib/constants/stock";
import { COUNTRY_VALUES, CARAT_VALUES } from "@/lib/constants/filters";
import type { AISearchProductList } from "@/lib/sanity/types/products";
import type { SearchProduct } from "@/lib/ai/types";

const productSearchSchema = z.object({
  query: z
    .string()
    .optional()
    .default("")
    .describe(
      "Search term to find products by name, description, or category (e.g., 'gold necklace', 'diamond ring', 'earrings')",
    ),
  category: z
    .string()
    .optional()
    .default("")
    .describe(
      "Filter by category slug (e.g., 'gold-jewelry', 'diamond-jewelry', 'rose-gold-jewelry')",
    ),
  country: z
    .enum(["", ...COUNTRY_VALUES])
    .optional()
    .default("")
    .describe(
      "Filter by country of origin (e.g., 'india', 'italy', 'dubai', 'usa', 'turkey', 'egypt')",
    ),
  carat: z
    .enum(["", ...CARAT_VALUES])
    .optional()
    .default("")
    .describe("Filter by gold carat (e.g., '14k', '18k', '22k', '24k')"),
  minPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Minimum price in GBP (e.g., 100)"),
  maxPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Maximum price in GBP (e.g., 500). Use 0 for no maximum."),
});

export const searchProductsTool = tool({
  description:
    "Search for products in the jewelry store. Can search by name, description, or category, and filter by country of origin, gold carat, and price range. Returns product details including stock availability.",
  inputSchema: productSearchSchema,
  execute: async ({ query, category, country, carat, minPrice, maxPrice }) => {
    console.log("[SearchProducts] Query received:", {
      query,
      category,
      country,
      carat,
      minPrice,
      maxPrice,
    });

    try {
      const { data: products } = await sanityFetch({
        query: AI_SEARCH_PRODUCTS_QUERY,
        params: {
          searchQuery: query || "",
          categorySlug: category || "",
          country: country || "",
          carat: carat || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 0,
        },
      });

      console.log("[SearchProducts] Products found:", products.length);

      if (products.length === 0) {
        return {
          found: false,
          message:
            "No products found matching your criteria. Try different search terms or filters.",
          products: [],
          filters: {
            query,
            category,
            country,
            carat,
            minPrice,
            maxPrice,
          },
        };
      }

      // Format the results with stock status for the AI to communicate
      const formattedProducts: SearchProduct[] = (
        products as AISearchProductList
      ).map((product) => ({
        id: product._id,
        name: product.name ?? null,
        slug: product.slug ?? null,
        description: product.description ?? null,
        price: product.price ?? null,
        priceFormatted: product.price ? formatPrice(product.price) : null,
        category: product.category?.title ?? null,
        categorySlug: product.category?.slug ?? null,
        country: product.country ?? null,
        carat: product.carat ?? null,
        dimensions: product.dimensions ?? null,
        stockCount: product.stock ?? 0,
        stockStatus: getStockStatus(product.stock),
        stockMessage: getStockMessage(product.stock),
        featured: product.featured ?? false,
        assemblyRequired: product.assemblyRequired ?? false,
        imageUrl: product.image?.asset?.url ?? null,
        productUrl: product.slug ? `/products/${product.slug}` : null,
      }));

      return {
        found: true,
        message: `Found ${products.length} product${products.length === 1 ? "" : "s"} matching your search.`,
        totalResults: products.length,
        products: formattedProducts,
        filters: {
          query,
          category,
          country,
          carat,
          minPrice,
          maxPrice,
        },
      };
    } catch (error) {
      console.error("[SearchProducts] Error:", error);
      return {
        found: false,
        message: "An error occurred while searching for products.",
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
        filters: {
          query,
          category,
          country,
          carat,
          minPrice,
          maxPrice,
        },
      };
    }
  },
});
