"use client";

import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export function GoldCartProductList() {
  const { items, updateQuantity, removeItem } = useGoldCart();

  if (items.length === 0) {
    return <div className="text-center text-zinc-400 py-12 text-lg font-medium">Your gold cart is empty.</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {items.map((item) => (
        <div key={item.productId} className="flex gap-4 items-center rounded-xl bg-yellow-50/60 p-3 shadow-sm border border-yellow-100">
          {item.image && (
            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-lg bg-yellow-100 object-cover border border-yellow-200" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-yellow-900 truncate">{item.name}</div>
            <div className="text-sm text-yellow-700 font-semibold">${item.price.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Button size="icon-sm" variant="ghost" className="border border-yellow-200" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>
                <Minus className="h-4 w-4 text-yellow-700" />
              </Button>
              <span className="font-bold text-yellow-900 text-base px-2">{item.quantity}</span>
              <Button size="icon-sm" variant="ghost" className="border border-yellow-200" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                <Plus className="h-4 w-4 text-yellow-700" />
              </Button>
              <Button size="icon-sm" variant="destructive" className="ml-2" onClick={() => removeItem(item.productId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
