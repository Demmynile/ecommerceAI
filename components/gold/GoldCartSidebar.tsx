"use client";

import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

interface GoldCartSidebarProps {
  open: boolean;
  onClose: () => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export function GoldCartSidebar({ open, onClose, onCheckout, onContinueShopping }: GoldCartSidebarProps) {
  const { items, updateQuantity, removeItem, clearCart } = useGoldCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Sidebar */}
      <aside
        className="relative ml-auto h-full w-full max-w-md bg-white rounded-l-3xl border-l-4 border-yellow-400 shadow-2xl flex flex-col animate-in slide-in-from-right-12 fade-in"
        style={{ boxShadow: '0 12px 48px 0 rgba(180, 140, 20, 0.25), 0 4px 24px 0 rgba(0,0,0,0.18)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-100/80">
          <h2 className="text-xl font-extrabold text-yellow-700 tracking-tight">Gold Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-yellow-100">
            <X className="h-6 w-6 text-yellow-600" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="text-center text-zinc-400 py-16 text-lg font-medium">Your gold cart is empty.</div>
          ) : (
            items.map((item) => (
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
            ))
          )}
        </div>
        <div className="px-6 py-5 border-t border-yellow-100/80 bg-yellow-50 rounded-b-3xl">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-yellow-800 text-lg">Total</span>
            <span className="text-2xl font-extrabold text-yellow-900">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold text-base py-3 rounded-xl shadow-md" onClick={onCheckout} disabled={items.length === 0}>
              Checkout
            </Button>
            <Button className="flex-1 border-yellow-300 text-yellow-900 font-semibold text-base py-3 rounded-xl" variant="outline" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
