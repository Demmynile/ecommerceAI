"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPageRange } from "@/lib/pagination/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: PaginationProps) {
  const pages = getPageRange(currentPage, totalPages, 5);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev || isLoading}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {/* First page if not in range */}
        {pages[0] > 1 && (
          <>
            <PaginationButton
              page={1}
              isActive={currentPage === 1}
              onPageChange={onPageChange}
              isLoading={isLoading}
            />
            {pages[0] > 2 && (
              <span className="flex h-9 w-9 items-center justify-center text-sm text-zinc-600">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}
          </>
        )}

        {/* Page range */}
        {pages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        ))}

        {/* Last page if not in range */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="flex h-9 w-9 items-center justify-center text-sm text-zinc-600">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}
            <PaginationButton
              page={totalPages}
              isActive={currentPage === totalPages}
              onPageChange={onPageChange}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface PaginationButtonProps {
  page: number;
  isActive: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

function PaginationButton({
  page,
  isActive,
  onPageChange,
  isLoading = false,
}: PaginationButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => onPageChange(page)}
      disabled={isLoading}
      className={cn(
        "h-9 w-9 p-0",
        isActive &&
          "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
      )}
    >
      {page}
    </Button>
  );
}

export function PaginationInfo({
  currentPage,
  pageSize,
  total,
  className,
}: {
  currentPage: number;
  pageSize: number;
  total: number;
  className?: string;
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className={cn("text-sm text-zinc-600 dark:text-zinc-400", className)}>
      Showing {start} to {end} of {total} results
    </div>
  );
}
