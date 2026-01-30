import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function GoldCartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { items, updateQuantity, removeItem } = useGoldCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg gap-0">
        <SheetHeader className="border-b border-zinc-200">
          <SheetTitle className="flex items-center gap-2 text-yellow-700">
            <ShoppingBag className="h-5 w-5 text-yellow-500" />
            Gold Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-yellow-200" />
            <h3 className="mt-4 text-lg font-medium text-yellow-900">Your gold cart is empty</h3>
            <p className="mt-1 text-sm text-yellow-500">Add some gold products to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="space-y-2 py-2 divide-y divide-yellow-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-yellow-50">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-yellow-300">No image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <span className="font-semibold text-yellow-900">{item.name}</span>
                        <Button size="icon-sm" variant="destructive" onClick={() => removeItem(item.productId)} aria-label="Remove from cart">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                          </svg>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn(
                          "flex h-9 w-28 items-center rounded-md border border-yellow-300 bg-white"
                        )}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full flex-1 rounded-r-none"
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4 text-yellow-700" />
                          </Button>
                          <span className="flex-1 text-center text-sm font-semibold tabular-nums text-yellow-900">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full flex-1 rounded-l-none"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4 text-yellow-700" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">£{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-yellow-100 p-4">
              <div className="flex justify-between text-base font-medium text-yellow-900">
                <span>Subtotal</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-sm text-yellow-500">Shipping calculated at checkout</p>
              <div className="mt-4">
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold">
                  <Link href="/gold/checkout" onClick={() => onOpenChange(false)}>
                    Checkout
                  </Link>
                </Button>
              </div>
              <div className="mt-3 text-center">
                <Link
                  href="/gold"
                  className="text-sm text-yellow-600 hover:text-yellow-800"
                  onClick={() => onOpenChange(false)}
                >
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
