"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LiveGoldPriceProps {
  currency?: string;
  showTrend?: boolean;
  updateInterval?: number; // in milliseconds
}

export function LiveGoldPrice({
  currency = "GBP",
  showTrend = true,
  updateInterval = 60000, // Update every minute
}: LiveGoldPriceProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = async () => {
    try {
      const response = await fetch(`/api/gold/price?currency=${currency}`);
      if (!response.ok) throw new Error("Failed to fetch price");

      const data = await response.json();
      setPreviousPrice(price);
      setPrice(data.price);
      setLastUpdated(new Date(data.lastUpdated));
      setError(null);
    } catch (err) {
      setError("Unable to fetch live price");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, updateInterval);
    return () => clearInterval(interval);
  }, [currency, updateInterval]);

  const trend =
    price !== null && previousPrice !== null
      ? price > previousPrice
        ? "up"
        : price < previousPrice
          ? "down"
          : "stable"
      : "stable";

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading live price...</span>
      </div>
    );
  }

  if (error || price === null) {
    return (
      <div className="text-sm text-red-500">{error || "Price unavailable"}</div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(price)}
          </span>
          {showTrend && trend !== "stable" && (
            <span
              className={`flex items-center text-sm ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="ml-1">
                {previousPrice &&
                  Math.abs(
                    ((price - previousPrice) / previousPrice) * 100,
                  ).toFixed(2)}
                %
              </span>
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          per troy oz • Updated {lastUpdated?.toLocaleTimeString() || "now"}
        </span>
      </div>
    </div>
  );
}
