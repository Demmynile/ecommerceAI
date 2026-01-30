"use client";

import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { GoldCartIcon } from "./GoldCartIcon";
import { Button } from "@/components/ui/button";

export function GoldCartButton({ onClick }: { onClick?: () => void }) {
  const { items } = useGoldCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative bg-yellow-100 hover:bg-yellow-200"
      onClick={onClick}
      aria-label={`Open gold cart (${totalItems} items)`}
    >
      <GoldCartIcon />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-zinc-900">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
      <span className="sr-only">Open gold cart ({totalItems} items)</span>
    </Button>
  );
}
