"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, Award, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateGoldProductPrice } from "@/lib/services/gold-pricing";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface GoldProduct {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  productForm: string;
  purity: string;
  weight: number;
  weightUnit: string;
  useLivePrice: boolean;
  premiumPercentage?: number;
  fixedPrice?: number;
  manufacturer?: string;
  images: any[];
  stock: number;
  featured?: boolean;
  isDigital?: boolean;
}

interface GoldProductCardProps {
  product: GoldProduct;
}

export function GoldProductCard({ product }: GoldProductCardProps) {
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
      console.log("Fetching live price for:", product.name, {
        weight: product.weight,
        weightUnit: product.weightUnit,
        purity: product.purity,
        premium: product.premiumPercentage,
      });

      const response = await fetch("/api/gold/price?currency=GBP");
      
      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }
      
      const data = await response.json();
      console.log("API response:", data);

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

      console.log("Calculated price:", calculatedPrice);
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

  const imageUrl = product.images?.[0]?.asset?.url || "/placeholder-gold.svg";

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/gold/${product.slug.current}`}>
        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-amber-500 text-white">
              <Award className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
          {product.isDigital && (
            <Badge className="absolute right-2 top-2 bg-blue-500 text-white">
              Digital
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/gold/${product.slug.current}`}>
          <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-zinc-900 transition-colors hover:text-amber-600 dark:text-zinc-100 dark:hover:text-amber-400">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2 flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Badge
            variant="outline"
            className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
          >
            {product.purity}
          </Badge>
          <Badge variant="outline">
            {product.weight}
            {product.weightUnit}
          </Badge>
          <Badge variant="outline">{product.productForm}</Badge>
        </div>

        {product.manufacturer && (
          <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
            by {product.manufacturer}
          </p>
        )}

        <div className="flex items-baseline gap-2">
          {loading ? (
            <div className="flex items-center gap-1 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Calculating...</span>
            </div>
          ) : (
            <>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {currentPrice ? formatPrice(currentPrice) : "£0.00"}
              </span>
              {product.useLivePrice && (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Live
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading || !currentPrice}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
