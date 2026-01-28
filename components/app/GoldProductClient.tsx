"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateGoldProductPrice } from "@/lib/services/gold-pricing";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface GoldProductClientProps {
  product: {
    _id: string;
    name: string;
    weight: number;
    weightUnit: string;
    purity: string;
    useLivePrice: boolean;
    premiumPercentage?: number;
    fixedPrice?: number;
    stock: number;
    images?: Array<{
      asset?: {
        url?: string;
      };
    }>;
  };
}

export function GoldProductClient({ product }: GoldProductClientProps) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(product.useLivePrice);
  const { addItem } = useCartActions();

  useEffect(() => {
    if (product.useLivePrice) {
      fetchLivePrice();
      // Update price every minute
      const interval = setInterval(fetchLivePrice, 60000);
      return () => clearInterval(interval);
    } else {
      setCurrentPrice(product.fixedPrice || 0);
      setLoading(false);
    }
  }, [product]);

  const fetchLivePrice = async () => {
    try {
      const response = await fetch("/api/gold/price?currency=GBP");

      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }

      const data = await response.json();

      if (!data.price) {
        throw new Error("Price not found in response");
      }

      const calculatedPrice = calculateGoldProductPrice(
        data.price,
        product.weight,
        product.weightUnit,
        product.purity,
        product.premiumPercentage || 3,
      );

      setCurrentPrice(calculatedPrice);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live price:", error);
      // Use fixed price as fallback
      setCurrentPrice(product.fixedPrice || 1000);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (currentPrice && product.stock > 0) {
      addItem({
        productId: product._id,
        name: product.name,
        price: currentPrice,
        image: product.images?.[0]?.asset?.url || "/placeholder-gold.svg",
        maxStock: product.stock,
        isGoldProduct: true,
      });
    }
  };

  return (
    <>
      {/* Display Price */}
      <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading price...</span>
          </div>
        ) : currentPrice ? (
          formatPrice(currentPrice)
        ) : (
          <span className="text-red-500">Price unavailable</span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full"
        disabled={product.stock === 0 || loading || !currentPrice}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </>
  );
}
