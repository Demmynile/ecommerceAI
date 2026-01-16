"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/pagination/constants";
import { cn } from "@/lib/utils";

export interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading?: boolean;
  showPageSize?: boolean;
  showJumpToPage?: boolean;
}

export function AdvancedPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  showPageSize = true,
  showJumpToPage = true,
}: AdvancedPaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage("");
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page Size Selector */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm font-medium">
              Items per page:
            </label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                onPageSizeChange(parseInt(value, 10));
              }}
              disabled={isLoading}
            >
              <SelectTrigger id="page-size" className="w-25">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Jump to Page */}
        {showJumpToPage && totalPages > 10 && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Go to page..."
              disabled={isLoading}
              className="h-9 w-24 rounded-md border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <Button
              size="sm"
              onClick={handleJumpToPage}
              disabled={isLoading || !jumpPage}
            >
              Go
            </Button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Page Number Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          ← Previous
        </Button>

        {/* Page Buttons */}
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={cn(
                currentPage === page &&
                  "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              )}
            >
              {page}
            </Button>
          );
        })}

        {totalPages > 10 && (
          <>
            <span className="flex items-center px-2">...</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
            >
              Last
            </Button>
          </>
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
