"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GoldChart } from "@/components/gold/GoldChart";
import { GoldAddToCartButton } from "@/components/gold/GoldAddToCartButton";
import { useGoldCart } from "@/lib/store/gold-cart-store-provider";
import { Header } from "@/components/app/Header";
import { GoldFilters } from "@/components/gold/GoldFilters";
import { GoldPagination } from "@/components/gold/GoldPagination";
import { GoldCartProductList } from "@/components/gold/GoldCartProductList";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";

// Example gold products (replace with real data or Sanity integration later)
const goldProducts = [
  { id: 1, name: "Digital Gold 1g Token", image: "/gold-bar-1g.png", price: 79.99 },
  { id: 2, name: "Digital Gold 5g Token", image: "/gold-bar-5g.png", price: 349.99 },
  { id: 3, name: "Digital Gold 10g Coin", image: "/gold-coin-10g.png", price: 699.99 },
  { id: 4, name: "Digital Gold 20g Token", image: "/gold-bar-5g.png", price: 1399.99 },
  { id: 5, name: "Digital Gold 50g Token", image: "/gold-bar-5g.png", price: 3499.99 },
  { id: 6, name: "Digital Gold 100g Token", image: "/gold-bar-5g.png", price: 6999.99 },
  { id: 7, name: "Digital Gold 1oz Coin", image: "/gold-coin-10g.png", price: 1599.99 },
  { id: 8, name: "Digital Gold 2oz Coin", image: "/gold-coin-10g.png", price: 3199.99 },
  { id: 9, name: "Digital Gold 5oz Coin", image: "/gold-coin-10g.png", price: 7999.99 },
  { id: 10, name: "Digital Gold Pendant", image: "/gold-bar-1g.png", price: 299.99 },
  { id: 11, name: "Digital Gold Ring", image: "/gold-bar-1g.png", price: 199.99 },
  { id: 12, name: "Digital Gold Necklace", image: "/gold-bar-5g.png", price: 999.99 },
  { id: 13, name: "Digital Gold Bracelet", image: "/gold-bar-1g.png", price: 649.99 },
  { id: 14, name: "Digital Gold Earrings", image: "/gold-coin-10g.png", price: 499.99 },
  { id: 15, name: "Digital Gold Watch", image: "/gold-bar-5g.png", price: 2499.99 },
  { id: 16, name: "Digital Gold Statue", image: "/gold-bar-1g.png", price: 5999.99 },
  { id: 17, name: "Digital Gold Medal", image: "/gold-coin-10g.png", price: 899.99 },
];


export default function GoldPage() {
  const { items } = useGoldCart();
  const goldItems = items.filter(
    (item) => item.slug === "gold" || item.name.toLowerCase().includes("gold")
  );

  // Filter and pagination state
  const [filters, setFilters] = React.useState({
    minPrice: 0,
    maxPrice: 1000,
    search: "",
  });
  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  // Simulate loading state for demonstration (replace with real loading logic if fetching from API)
  const [loading, setLoading] = React.useState(false);
  // Example: set loading true for 1s on filter/page change
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [filters, page]);



  // Compute filtered products
  const filtered = goldProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [filters]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Chart at the top */}
        <section className="bg-zinc-100 rounded-lg p-6 shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-yellow-700">Live Gold Price Chart</h2>
          <GoldChart />
        </section>
        <h1 className="text-3xl font-bold mb-6 text-yellow-700">Buy Gold</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters and Cart List */}
          <aside className="md:w-1/3 lg:w-1/4 mb-8 md:mb-0 flex flex-col gap-6 md:sticky md:top-8 md:h-fit">
            <GoldFilters
              minPrice={0}
              maxPrice={1000}
              onFilter={setFilters}
            />
            {/* Gold cart product list removed from main page; now only in sidebar */}
          </aside>
          {/* Products Grid */}
          <section className="flex-1">
            <div className="mb-12">
              {loading ? (
                <ProductGridSkeleton />
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-yellow-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-sm text-yellow-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginated.map((product) => (
                    <div
                      key={product.id}
                      className="relative group bg-white/20 backdrop-blur-lg border border-yellow-300/40 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/40 overflow-hidden"
                      style={{ boxShadow: '0 4px 32px 0 rgba(255, 215, 0, 0.15), 0 1.5px 8px 0 rgba(255, 215, 0, 0.10)' }}
                    >
                      {/* Gold Glow Effect */}
                      <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl group-hover:blur-md group-hover:opacity-80 transition-all duration-300" style={{
                        background: 'radial-gradient(circle at 50% 30%, #ffe066 0%, #fffbe6 40%, transparent 80%)',
                        opacity: 0.7
                      }} />
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="mb-4 z-10 drop-shadow-[0_4px_24px_rgba(255,215,0,0.25)] group-hover:scale-105 transition-transform duration-300"
                      />
                      <h2 className="z-10 text-lg font-bold mb-2 text-yellow-700 drop-shadow-[0_1px_4px_rgba(255,215,0,0.25)] tracking-wide uppercase text-center">
                        {product.name}
                      </h2>
                      <p className="z-10 text-2xl font-extrabold mb-4 text-yellow-500 drop-shadow-[0_2px_8px_rgba(255,215,0,0.25)] tracking-wider">
                        £{product.price.toFixed(2)}
                      </p>
                      <GoldAddToCartButton
                        productId={String(product.id)}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                      />
                      {/* Glow border on hover */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-yellow-400/60 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_32px_8px_rgba(255,215,0,0.25)] transition-all duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <GoldPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            {/* Checkout button removed from main page; now only in sidebar */}
          </section>
        </div>
      </main>
    </>
  );
}
