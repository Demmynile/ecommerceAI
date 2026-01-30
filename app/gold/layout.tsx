
import { ClerkProvider } from "@clerk/nextjs";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { GoldCartProvider } from "@/lib/store/gold-cart-store-provider";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";

export default function GoldLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <GoldCartProvider>
          <ChatStoreProvider>{children}</ChatStoreProvider>
        </GoldCartProvider>
      </CartStoreProvider>
    </ClerkProvider>
  );
}
