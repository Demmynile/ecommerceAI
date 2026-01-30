import { ShoppingBag } from "lucide-react";

export function GoldCartIcon({ className = "" }: { className?: string }) {
  return (
    <ShoppingBag className={`h-5 w-5 text-yellow-500 ${className}`} />
  );
}
