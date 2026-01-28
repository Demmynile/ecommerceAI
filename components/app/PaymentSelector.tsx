"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Bitcoin } from "lucide-react";
import {
  useCartItems,
  useTotalPrice,
  useCartActions,
} from "@/lib/store/cart-store-provider";

type PaymentMethod = "stripe" | "coinbase";

interface PaymentSelectorProps {
  disabled?: boolean;
}

export function PaymentSelector({ disabled = false }: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const { clearCart } = useCartActions();

  const handleCheckout = async () => {
    if (disabled || items.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare checkout items
      const checkoutItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        description: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.image ? [item.image] : [],
        productType: "product", // Can be extended to support goldProduct
      }));

      // Call the appropriate payment API
      const endpoint =
        selectedMethod === "stripe"
          ? "/api/payment/stripe/checkout"
          : "/api/payment/coinbase/checkout";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          metadata: {
            totalItems: items.length,
            totalAmount: totalPrice,
            requiresShipping: items.some((item) => !item.isDigital),
          },
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to payment page
      if (data.url) {
        // Clear cart before redirect
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Payment Method Selection */}
      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            1
          </span>
          Select Payment Method
        </label>
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => setSelectedMethod("stripe")}
            disabled={disabled || isProcessing}
            className={`group relative flex items-start gap-4 rounded-xl border-2 p-5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 ${
              selectedMethod === "stripe"
                ? "border-blue-500 bg-linear-to-br from-blue-50 to-blue-100/50 shadow-md dark:border-blue-400 dark:from-blue-950/40 dark:to-blue-900/20"
                : "border-zinc-200 bg-white hover:border-blue-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-blue-600"
            } ${disabled || isProcessing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                selectedMethod === "stripe"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-zinc-100 text-zinc-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-zinc-800 dark:group-hover:bg-blue-900/50"
              }`}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Credit or Debit Card
                </span>
                {selectedMethod === "stripe" && (
                  <Badge className="shrink-0 bg-blue-500 text-white hover:bg-blue-500">
                    ✓ Selected
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Secure payment with Visa, Mastercard, Amex
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">Powered by</span>
                <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">Stripe</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod("coinbase")}
            disabled={disabled || isProcessing}
            className={`group relative flex items-start gap-4 rounded-xl border-2 p-5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 ${
              selectedMethod === "coinbase"
                ? "border-amber-500 bg-linear-to-br from-amber-50 to-amber-100/50 shadow-md dark:border-amber-400 dark:from-amber-950/40 dark:to-amber-900/20"
                : "border-zinc-200 bg-white hover:border-amber-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-amber-600"
            } ${disabled || isProcessing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                selectedMethod === "coinbase"
                  ? "bg-amber-500 text-white dark:bg-amber-600"
                  : "bg-zinc-100 text-zinc-500 group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-zinc-800 dark:group-hover:bg-amber-900/50"
              }`}
            >
              <Bitcoin className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Cryptocurrency
                </span>
                {selectedMethod === "coinbase" && (
                  <Badge className="shrink-0 bg-amber-500 text-white hover:bg-amber-500">
                    ✓ Selected
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Pay with Bitcoin, Ethereum, USDC & more
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">Powered by</span>
                <span className="rounded bg-amber-600 px-1.5 py-0.5 text-xs font-bold text-white">Coinbase</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Supported Cryptocurrencies */}
      {selectedMethod === "coinbase" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-xl border border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50/50 p-4 shadow-sm dark:border-amber-800/50 dark:from-amber-950/30 dark:to-yellow-950/20">
          <div className="mb-2.5 flex items-center gap-2">
            <Bitcoin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              Supported Cryptocurrencies
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["BTC", "ETH", "USDC", "LTC", "BCH", "DOGE"].map((crypto) => (
              <span
                key={crypto}
                className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
              >
                {crypto}
              </span>
            ))}
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              +more
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Checkout Button */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            2
          </span>
          Complete Payment
        </label>
        <Button
          onClick={handleCheckout}
          disabled={disabled || isProcessing}
          className={`h-12 w-full text-base font-semibold shadow-lg transition-all ${
            selectedMethod === "stripe"
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              : "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700"
          }`}
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              {selectedMethod === "stripe" ? (
                <CreditCard className="mr-2 h-5 w-5" />
              ) : (
                <Bitcoin className="mr-2 h-5 w-5" />
              )}
              Proceed to {selectedMethod === "stripe" ? "Stripe" : "Coinbase"} →
            </>
          )}
        </Button>
      </div>

      {/* Security Note */}
      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50">
        <p className="text-center text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold">🔒 Secure Checkout</span>
          <br />
          All transactions are encrypted and your payment info is never stored.
        </p>
      </div>
    </div>
  );
}
