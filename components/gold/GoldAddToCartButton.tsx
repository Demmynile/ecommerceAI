"use client";


import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


interface GoldAddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  className?: string;
  stock?: number; // Optional, for future use
}


export function GoldAddToCartButton({ productId, name, price, image, className, stock = 99 }: GoldAddToCartButtonProps) {
  const { items, addItem, updateQuantity, removeItem } = useGoldCart();
  const cartItem = items.find((i) => i.productId === productId);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    if (quantityInCart < stock) {
      addItem({ productId, slug: "gold", name, price, image }, 1);
      toast.success(`Added ${name} to cart!`);
    }
  };

  const handleDecrement = () => {
    if (quantityInCart > 1) {
      updateQuantity(productId, quantityInCart - 1);
    } else if (quantityInCart === 1) {
      removeItem(productId);
    }
  };

  // Not in cart - show Add to Basket button
  if (quantityInCart === 0) {
    return (
      <Button onClick={handleAdd} className={cn("h-11 w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold", className)}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add to Basket
      </Button>
    );
  }

  // In cart - show quantity controls
  return (
    <div className={cn("flex h-11 w-full items-center rounded-md border border-yellow-300 bg-white", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-r-none"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4 text-yellow-700" />
      </Button>
      <span className="flex-1 text-center text-sm font-semibold tabular-nums text-yellow-900">
        {quantityInCart}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-l-none disabled:opacity-20"
        onClick={handleAdd}
        disabled={isAtMax}
      >
        <Plus className="h-4 w-4 text-yellow-700" />
      </Button>
    </div>
  );
}
