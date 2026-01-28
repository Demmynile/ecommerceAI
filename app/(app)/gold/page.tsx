import { client } from "@/sanity/lib/client";
import { GoldProductCard } from "@/components/app/GoldProductCard";
import { LiveGoldPrice } from "@/components/app/LiveGoldPrice";
import { GoldPriceChart } from "@/components/app/GoldPriceChart";
import { ProductPagination } from "@/components/app/ProductPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Shield, Zap } from "lucide-react";

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string; purity?: string; form?: string }>;
}

export const metadata = {
  title: "Gold Trading Platform | Buy Gold Online",
  description:
    "Trade gold with live pricing, accept fiat and cryptocurrency payments",
};

async function getGoldProducts(
  page: number,
  filters: { purity?: string; form?: string },
) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  // Build filter query
  let filterQuery = "";
  if (filters.purity) {
    filterQuery += ` && purity == "${filters.purity}"`;
  }
  if (filters.form) {
    filterQuery += ` && productForm == "${filters.form}"`;
  }

  const query = `{
    "products": *[_type == "goldProduct"${filterQuery}] | order(featured desc, _createdAt desc) [${start}...${end}] {
      _id,
      name,
      slug,
      description,
      productForm,
      purity,
      weight,
      weightUnit,
      useLivePrice,
      premiumPercentage,
      fixedPrice,
      manufacturer,
      images[]{
        asset->{
          _id,
          url
        },
        alt
      },
      stock,
      featured,
      isDigital
    },
    "total": count(*[_type == "goldProduct"${filterQuery}])
  }`;

  return client.fetch(query);
}

export default async function GoldPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const purityFilter = searchParams.purity;
  const formFilter = searchParams.form;

  const { products, total } = await getGoldProducts(currentPage, {
    purity: purityFilter,
    form: formFilter,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Coins className="h-10 w-10 text-amber-500" />
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Gold Trading Platform
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Buy authentic gold with live market pricing. Accept payments in fiat
          (Stripe) or cryptocurrency (Coinbase).
        </p>

        {/* Current Gold Price */}
        <div className="mx-auto mt-8 max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Current Spot Price
              </div>
              <LiveGoldPrice currency="GBP" showTrend />
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Live Pricing</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Certified Authentic</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium">Instant Settlement</span>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="mb-12">
        <GoldPriceChart defaultPeriod={30} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Filter by:
        </span>
        <Badge
          variant={!purityFilter ? "default" : "outline"}
          className="cursor-pointer"
        >
          All Purities
        </Badge>
        <Badge
          variant={purityFilter === "24k" ? "default" : "outline"}
          className="cursor-pointer"
        >
          24K
        </Badge>
        <Badge
          variant={purityFilter === "22k" ? "default" : "outline"}
          className="cursor-pointer"
        >
          22K
        </Badge>
        <Badge
          variant={purityFilter === "18k" ? "default" : "outline"}
          className="cursor-pointer"
        >
          18K
        </Badge>
        <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
        <Badge
          variant={formFilter === "bar" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Bars
        </Badge>
        <Badge
          variant={formFilter === "coin" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Coins
        </Badge>
        <Badge
          variant={formFilter === "digital" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Digital
        </Badge>
      </div>

      {/* Product Count */}
      <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Showing {products.length} of {total} products
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Coins className="mx-auto mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-700" />
          <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            No products found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any) => (
              <GoldProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={{
                  purity: purityFilter,
                  form: formFilter,
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
