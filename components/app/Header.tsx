"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, Sparkles, User, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";
import React from "react";


export function Header() {
  
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 py-2">
          <Image
            src="/mola.png"
            alt="Mola"
            width={320}
            height={120}
            className="h-24 md:h-28 lg:h-24 w-auto px-4 md:px-6 py-2"
            priority
          />
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="flex md:hidden items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Menu className="h-7 w-7" />
          )}
        </button>

        {/* Actions (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {/* My Orders - Only when signed in */}
          <SignedIn>
            <Button asChild>
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">My Orders</span>
              </Link>
            </Button>
          </SignedIn>

          {/* AI Shopping Assistant */}
          {!isChatOpen && (
            <Button
              onClick={openChat}
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/50 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-300/50 dark:shadow-amber-900/30 dark:hover:shadow-amber-800/40"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Ask AI</span>
            </Button>
          )}

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="sr-only">Open cart ({totalItems} items)</span>
          </Button>

          {/* User */}
          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Package className="h-4 w-4" />}
                  href="/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Actions (mobile menu) */}
          {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-950 shadow-md border-b border-zinc-200 dark:border-zinc-800 flex flex-col items-stretch gap-2 px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-4 z-50">
            {/* My Orders - Only when signed in */}
            <SignedIn>
              <Button asChild className="w-full justify-start">
                <Link href="/orders" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium">My Orders</span>
                </Link>
              </Button>
            </SignedIn>
            {/* AI Shopping Assistant */}
            {!isChatOpen && (
              <Button
                onClick={() => {
                  openChat();
                  setMobileMenuOpen(false);
                }}
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/50 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-300/50 dark:shadow-amber-900/30 dark:hover:shadow-amber-800/40 w-full justify-start"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Ask AI</span>
              </Button>
            )}
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-full justify-start"
              onClick={() => {
                openCart();
                setMobileMenuOpen(false);
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="sr-only">Open cart ({totalItems} items)</span>
            </Button>
            {/* User */}
            <SignedIn>
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Orders"
                    labelIcon={<Package className="h-4 w-4" />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon" className="w-full justify-start">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
      
      </div>
    </header>
  );
}
