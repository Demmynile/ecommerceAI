# Gold Trading Platform - Setup Guide

## Overview

This is a comprehensive gold trading platform built with Next.js 16, Sanity CMS 4, with dual payment support (Stripe for fiat, Coinbase for crypto). Features include:

- ✅ Live gold pricing with real-time updates
- ✅ Digital and physical gold products (bars, coins, certificates)
- ✅ Dual payment support (Stripe + Coinbase Commerce)
- ✅ Interactive price charts with historical data
- ✅ Paginated product listings
- ✅ Mobile-responsive design

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

#### Required API Keys:

**Sanity:**
- Get from https://sanity.io/manage
- Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`

**Stripe:**
- Get from https://dashboard.stripe.com/apikeys
- Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Coinbase Commerce:**
- Get from https://commerce.coinbase.com/dashboard/settings
- Set `COINBASE_COMMERCE_API_KEY`

**Gold API (Optional):**
- Get free API key from https://goldapi.io
- Set `GOLD_API_KEY` (if not set, mock data will be used)

### 3. Deploy Sanity Schema

The gold product schema has been created. Deploy it to Sanity:

```bash
npm run typegen
sanity schema deploy
```

Or deploy directly via CLI:
```bash
npx sanity@latest schema deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Frontend:** http://localhost:3000
- **Gold Trading:** http://localhost:3000/gold
- **Sanity Studio:** http://localhost:3000/studio

## Adding Gold Products

### Via Sanity Studio:

1. Navigate to http://localhost:3000/studio
2. Click **"Gold Product"** in the sidebar
3. Click **"Create"** button
4. Fill in the product details:
   - **Name:** e.g., "1oz Gold Bar - 24K"
   - **Product Form:** Bar, Coin, Digital, or Jewelry
   - **Purity:** 24K, 22K, 18K, or 14K
   - **Weight & Unit:** e.g., 1 oz, 10g, 1kg
   - **Live Price:** Toggle on for real-time pricing
   - **Premium %:** Markup above spot price (e.g., 3%)
   - **Images:** Upload product images
   - **Stock:** Available quantity
5. Click **"Publish"**

### Sample Products via GROQ:

You can also create sample products programmatically:

```javascript
// In Sanity Studio Vision tool or via API
{
  _type: "goldProduct",
  name: "1oz Gold Bar - 24K PAMP Suisse",
  slug: { current: "1oz-gold-bar-24k-pamp" },
  description: "Premium 1 troy ounce gold bar from PAMP Suisse",
  productForm: "bar",
  purity: "24k",
  weight: 1,
  weightUnit: "oz",
  useLivePrice: true,
  premiumPercentage: 3,
  manufacturer: "PAMP Suisse",
  stock: 50,
  featured: true,
  isDigital: false
}
```

## Project Structure

```
app/
├── (app)/
│   ├── gold/                    # Gold trading pages
│   │   ├── page.tsx            # Gold products listing with pagination
│   │   └── [slug]/page.tsx     # Individual gold product page
│   ├── checkout/
│   │   └── CheckoutClient.tsx  # Enhanced with payment selector
│   └── api/
│       ├── gold/
│       │   ├── price/          # Live gold price API
│       │   └── history/        # Historical price data
│       └── payment/
│           ├── stripe/         # Stripe checkout
│           └── coinbase/       # Coinbase Commerce checkout
components/
├── app/
│   ├── GoldProductCard.tsx     # Gold product card with live pricing
│   ├── LiveGoldPrice.tsx       # Real-time price display
│   ├── GoldPriceChart.tsx      # Interactive price chart
│   └── PaymentSelector.tsx     # Stripe/Coinbase selector
lib/
└── services/
    └── gold-pricing.ts         # Gold pricing calculations
sanity/
└── schemaTypes/
    └── goldProductType.ts      # Gold product schema
```

## Features

### 1. Live Gold Pricing

Real-time gold prices are fetched from GoldAPI.io (or mock data in development). Prices update every 60 seconds automatically.

```typescript
// Calculate product price from spot price
const price = calculateGoldProductPrice(
  spotPrice,     // Current gold price per oz
  weight,        // Product weight
  weightUnit,    // oz, g, or kg
  purity,        // 24k, 22k, etc.
  premium        // Percentage markup
);
```

### 2. Dual Payment Support

**Stripe (Fiat):**
- Credit/debit cards
- Instant payment confirmation
- Automatic currency conversion

**Coinbase Commerce (Crypto):**
- Bitcoin, Ethereum, Litecoin, Bitcoin Cash
- USDC, DAI, and more
- Wallet-to-wallet payments

### 3. Product Pagination

Gold products are paginated (12 per page) using the existing `AdvancedPagination` component. Filter by:
- Purity (24K, 22K, 18K, 14K)
- Form (Bar, Coin, Digital, Jewelry)

### 4. Price Charts

Historical gold price charts powered by Recharts:
- 7-day, 1-month, 3-month, 1-year views
- Responsive area charts
- Price change percentages

### 5. Digital Products

Support for both physical and digital gold products:
- Physical: Shipped to customer
- Digital: Certificate of ownership (no shipping)

## API Endpoints

### Gold Pricing

```bash
# Current spot price
GET /api/gold/price?currency=GBP

# Historical data
GET /api/gold/history?days=30
```

### Payment

```bash
# Create Stripe checkout
POST /api/payment/stripe/checkout

# Create Coinbase Commerce charge
POST /api/payment/coinbase/checkout
```

## Customization

### Change Default Currency

Edit [lib/services/gold-pricing.ts](lib/services/gold-pricing.ts):

```typescript
const EXCHANGE_RATES = {
  USD_TO_GBP: 0.79,
  USD_TO_EUR: 0.92,
  // Add more currencies
};
```

### Adjust Premium Percentage

Default premium is 3%. Change in Sanity Studio or schema:

```typescript
initialValue: 3, // Change this in goldProductType.ts
```

### Modify Update Intervals

Live prices update every 60 seconds. Change in components:

```typescript
updateInterval={60000} // milliseconds
```

## Testing

### Test Mode Keys

Use Stripe test mode keys during development:
```
STRIPE_SECRET_KEY=sk_test_...
```

Use Coinbase Commerce sandbox:
```
COINBASE_COMMERCE_API_KEY=<sandbox-key>
```

### Mock Data

If `GOLD_API_KEY` is not set, the app uses realistic mock data for gold prices.

## Deployment

### Vercel (Recommended)

```bash
vercel
```

Make sure to set all environment variables in Vercel dashboard.

### Environment Variables Checklist

- [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
- [ ] NEXT_PUBLIC_SANITY_DATASET
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] COINBASE_COMMERCE_API_KEY
- [ ] GOLD_API_KEY (optional)
- [ ] NEXT_PUBLIC_BASE_URL

## Troubleshooting

### Gold prices not loading?

- Check `GOLD_API_KEY` is set correctly
- Verify API rate limits (free tier: 100 requests/day)
- Check browser console for errors

### Payment not working?

- Ensure Stripe/Coinbase keys are correct
- Check webhook secrets are configured
- Verify `NEXT_PUBLIC_BASE_URL` matches deployment URL

### Products not showing?

- Run `npm run typegen` to regenerate types
- Deploy schema: `sanity schema deploy`
- Check products are published in Sanity Studio

## License

MIT

## Support

For issues, create a GitHub issue or contact support.
