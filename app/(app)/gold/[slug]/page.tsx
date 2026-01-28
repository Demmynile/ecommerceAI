import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { LiveGoldPrice } from "@/components/app/LiveGoldPrice";
import { GoldPriceChart } from "@/components/app/GoldPriceChart";
import { GoldProductClient } from "@/components/app/GoldProductClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Award,
  Package,
  Shield,
  TrendingUp,
  Truck,
  FileText,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGoldProduct(slug: string) {
  const query = `*[_type == "goldProduct" && slug.current == $slug][0] {
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
    certificationNumber,
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
  }`;

  return client.fetch(query, { slug });
}

export default async function GoldProductPage(props: PageProps) {
  const params = await props.params;
  const product = await getGoldProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
            <Image
              src={product.images?.[0]?.asset?.url || "/placeholder-gold.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && (
              <Badge className="absolute left-4 top-4 bg-amber-500 text-white">
                <Award className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image: any, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900"
                >
                  <Image
                    src={image?.asset?.url || "/placeholder-gold.svg"}
                    alt={`${product.name} ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                {product.purity}
              </Badge>
              <Badge variant="outline">
                {product.weight}
                {product.weightUnit}
              </Badge>
              <Badge variant="outline">{product.productForm}</Badge>
              {product.isDigital && (
                <Badge className="bg-blue-500 text-white">
                  Digital Certificate
                </Badge>
              )}
            </div>
          </div>

          {/* Live Price */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <TrendingUp className="h-4 w-4" />
                {product.useLivePrice ? "Live Market Price" : "Fixed Price"}
              </div>
              <GoldProductClient product={product} />
              {product.useLivePrice && product.premiumPercentage && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Includes {product.premiumPercentage}% premium above spot price
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stock Status */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-zinc-500" />
              <span className="font-medium">Availability</span>
            </div>
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Product Details
            </h2>

            {product.description && (
              <p className="text-zinc-600 dark:text-zinc-400">
                {product.description}
              </p>
            )}

            <div className="space-y-2 text-sm">
              {product.manufacturer && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Manufacturer:
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.manufacturer}
                  </span>
                </div>
              )}
              {product.certificationNumber && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Certification:
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.certificationNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Product Form:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.productForm}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Delivery:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.isDigital
                    ? "Digital Certificate"
                    : "Physical Shipping"}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Certified Authentic</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Live Pricing</span>
            </div>
            {!product.isDigital && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-amber-500" />
                <span>Secure Shipping</span>
              </div>
            )}
            {product.isDigital && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-purple-500" />
                <span>Digital Ownership</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="mt-12">
        <GoldPriceChart defaultPeriod={30} />
      </div>
    </div>
  );
}
