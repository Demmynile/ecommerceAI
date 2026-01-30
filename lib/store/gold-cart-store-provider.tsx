"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface GoldCartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface GoldCartContextType {
  items: GoldCartItem[];
  addItem: (item: Omit<GoldCartItem, "quantity">, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const GoldCartContext = createContext<GoldCartContextType | undefined>(undefined);

export function GoldCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GoldCartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gold-cart");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("gold-cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  // Rehydrate on mount (for SSR/Next.js)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gold-cart");
        if (stored) setItems(JSON.parse(stored));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = (item: Omit<GoldCartItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId

            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  return (
    <GoldCartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </GoldCartContext.Provider>
  );
}

export function useGoldCart() {
  const ctx = useContext(GoldCartContext);
  if (!ctx) throw new Error("useGoldCart must be used within GoldCartProvider");
  return ctx;
}
