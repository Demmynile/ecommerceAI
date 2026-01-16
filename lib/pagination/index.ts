/**
 * Main export file for pagination utilities
 * Use these imports to access all pagination functionality
 */

// Constants
export {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "./constants";

// Types
export type {
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  PaginationState,
} from "./types";

// Utilities
export {
  validatePaginationParams,
  calculateOffset,
  generatePaginationMeta,
  buildPaginationQueryString,
  generateGroqSlice,
  getPageRange,
} from "./utils";

// Query Helpers
export {
  createPaginatedQuery,
  createPaginatedProductQuery,
  createCountedAndPaginatedQuery,
  PAGINATED_PRODUCT_PROJECTION,
  PAGINATED_PRODUCT_FILTER_CONDITIONS,
} from "./queries";

// Hooks
export {
  usePagination,
  useFilterParams,
  usePaginationWithFilters,
} from "./hooks";
