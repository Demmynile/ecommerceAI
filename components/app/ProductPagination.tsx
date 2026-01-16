"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export function ProductPagination({
  currentPage,
  totalPages,
  searchParams,
}: ProductPaginationProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();

    // Preserve all current search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && key !== "page") {
        params.append(key, value);
      }
    });

    // Set new page
    params.set("page", String(newPage));

    // Use router.push for smooth navigation without page refresh
    router.push(`?${params.toString()}#products-section`);
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
