

"use client";
import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { GoldPaymentOptions } from "@/components/gold/GoldPaymentOptions";
import Image from "next/image";


import Link from "next/link";

export default function GoldCheckoutPage() {
  const { items, clearCart } = useGoldCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelect = (method: string) => {
    alert(`Selected payment method: ${method}`);
    // Here you would trigger Stripe or Coinbase checkout
    clearCart();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-zinc-50 py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/gold" className="inline-block text-yellow-700 hover:text-yellow-900 font-semibold text-sm px-3 py-2 rounded transition-colors bg-yellow-100 hover:bg-yellow-200">
          ← Return to Digital Gold
        </Link>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Checkout Card */}
        <section className="md:col-span-2 bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-yellow-100">
          <h1 className="text-3xl font-extrabold text-yellow-700 mb-2 tracking-tight">Gold Checkout</h1>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400 text-lg font-medium">
              <Image src="/gold-bar-1g.png" alt="Empty" width={64} height={64} className="mb-4 opacity-60" />
              No gold products in your cart.
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="divide-y divide-yellow-100">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-5 py-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-yellow-50 border border-yellow-100">
                      <Image src={item.image || "/gold-bar-1g.png"} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-yellow-900 truncate text-lg">{item.name}</div>
                      <div className="text-sm text-yellow-700 font-semibold">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-extrabold text-yellow-700 text-lg">£{(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        {/* Order Summary Sticky Card */}
        <aside className="md:col-span-1 sticky top-10 self-start bg-yellow-50/80 rounded-3xl shadow-xl border border-yellow-200 p-8 flex flex-col gap-6 min-w-[260px] max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-yellow-800 mb-2 tracking-tight">Order Summary</h2>
          <div className="flex flex-col gap-2 text-base">
            <div className="flex justify-between">
              <span className="text-zinc-700 font-medium">Subtotal</span>
              <span className="font-bold text-yellow-900 text-lg">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shipping</span>
              <span className="text-zinc-400">Calculated at payment</span>
            </div>
          </div>
          <div className="mt-4">
            <GoldPaymentOptions onSelect={handleSelect} />
          </div>
          <div className="text-center mt-2 text-xs text-zinc-400">Secured checkout. Powered by Stripe & Coinbase.</div>
        </aside>
      </div>
    </main>
  );
}
