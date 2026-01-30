import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GoldFiltersProps {
  minPrice: number;
  maxPrice: number;
  onFilter: (filters: { minPrice: number; maxPrice: number; search: string }) => void;
}

export function GoldFilters({ minPrice, maxPrice, onFilter }: GoldFiltersProps) {
  const [price, setPrice] = React.useState<[number, number]>([minPrice, maxPrice]);
  const [search, setSearch] = React.useState("");

  // Auto-apply filters when search or price changes
  React.useEffect(() => {
    onFilter({ minPrice: price[0], maxPrice: price[1], search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, search]);

  return (
    <div className="bg-white/70 rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-yellow-100/60">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-yellow-700">Search</label>
        <Input
          placeholder="Search gold products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border-yellow-200 focus:border-yellow-400 focus:ring-yellow-300/40"
        />
      </div>
      <div className="flex flex-col gap-2 pt-2 border-t border-yellow-100/60">
        <label className="text-sm font-semibold text-yellow-700">Price Range</label>
        <Slider
          min={minPrice}
          max={maxPrice}
          value={price}
          onValueChange={val => setPrice([val[0], val[1]])}
          step={1}
        />
        <div className="flex justify-between text-xs text-yellow-700 font-medium mt-1">
          <span>${price[0]}</span>
          <span>${price[1]}</span>
        </div>
      </div>
    </div>
  );
}
