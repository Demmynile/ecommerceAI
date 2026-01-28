# 🚀 Gold Trading Platform - Quick Start Checklist

## ✅ Implementation Status: COMPLETE

All features have been successfully implemented. Follow this checklist to deploy and launch your gold trading platform.

---

## 📋 Pre-Launch Checklist

### 1. Environment Setup

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required API keys (see below)
- [ ] Verify `NEXT_PUBLIC_BASE_URL` matches your domain

#### Required API Keys:

```bash
# Sanity CMS (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Stripe (Required for fiat payments)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Coinbase Commerce (Required for crypto payments)
COINBASE_COMMERCE_API_KEY=...

# Gold API (Optional - uses mock if not set)
GOLD_API_KEY=goldapi_...

# Clerk Auth (Already configured)
# Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Where to get API keys:**
- Sanity: https://sanity.io/manage
- Stripe: https://dashboard.stripe.com/apikeys
- Coinbase Commerce: https://commerce.coinbase.com/dashboard/settings
- Gold API: https://goldapi.io (free tier: 100 requests/day)

---

### 2. Database Schema Deployment

- [ ] Run: `npm run typegen` (✅ Already done)
- [ ] Deploy schema: `npx sanity@latest schema deploy`
- [ ] Verify schema in Sanity Studio: http://localhost:3000/studio

---

### 3. Create Sample Gold Products

Navigate to http://localhost:3000/studio and create products:

**Suggested Products:**

1. **1oz Gold Bar - 24K**
   - Form: Bar
   - Purity: 24k
   - Weight: 1 oz
   - Live Price: On
   - Premium: 3%
   - Stock: 50

2. **Gold Coin - American Eagle**
   - Form: Coin
   - Purity: 22k
   - Weight: 1 oz
   - Live Price: On
   - Premium: 5%
   - Stock: 100

3. **Digital Gold Certificate - 10g**
   - Form: Digital
   - Purity: 24k
   - Weight: 10 g
   - Live Price: On
   - Premium: 2%
   - Digital: Yes
   - Stock: 1000

- [ ] Create at least 3-5 sample products
- [ ] Upload product images
- [ ] Publish all products

---

### 4. Test Payments

#### Stripe Test Mode:
```bash
# Use test keys in .env.local
STRIPE_SECRET_KEY=sk_test_...
```

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

#### Coinbase Commerce:
- Use sandbox API key for testing
- Test with small crypto amounts

- [ ] Test Stripe checkout flow
- [ ] Test Coinbase crypto payment
- [ ] Verify success page for both methods
- [ ] Check cart clears after purchase

---

### 5. Payment Webhooks (Production Only)

#### Stripe Webhooks:
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy webhook secret to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

#### Coinbase Commerce Webhooks:
1. Go to: https://commerce.coinbase.com/settings
2. Add webhook URL: `https://yourdomain.com/api/webhooks/coinbase`
3. Copy webhook secret to `.env.local`

- [ ] Configure Stripe webhooks
- [ ] Configure Coinbase webhooks
- [ ] Test webhook delivery

---

### 6. Build & Deploy

#### Local Test:
```bash
npm run build
npm run start
```

#### Deploy to Vercel:
```bash
vercel --prod
```

- [ ] Build passes without errors
- [ ] All environment variables added to Vercel
- [ ] Deployment successful
- [ ] Test live site

---

### 7. Post-Deployment Verification

Visit your live site and verify:

- [ ] Homepage loads correctly
- [ ] Navigate to /gold page
- [ ] Live gold price displays
- [ ] Price chart renders
- [ ] Products load with pagination
- [ ] Click product to view details
- [ ] Add to cart works
- [ ] Checkout page loads
- [ ] Payment method selector works
- [ ] Complete test purchase (Stripe)
- [ ] Complete test purchase (Coinbase)
- [ ] Success page displays correctly
- [ ] Email confirmations sent (if configured)

---

## 🎨 Customization (Optional)

### Branding
- [ ] Update logo in `public/mola.png`
- [ ] Customize color scheme in `tailwind.config.ts`
- [ ] Update site name in metadata

### Pricing
- [ ] Adjust default premium percentage in schema (currently 3%)
- [ ] Configure currency (currently GBP)
- [ ] Set low stock threshold (currently 5)

### Features
- [ ] Enable/disable cryptocurrency payments
- [ ] Add more gold product forms
- [ ] Configure shipping options
- [ ] Set up email notifications

---

## 📊 Monitoring & Analytics

### Recommended Tools:
- [ ] Vercel Analytics (built-in)
- [ ] Stripe Dashboard for payment monitoring
- [ ] Coinbase Commerce dashboard for crypto tracking
- [ ] Google Analytics (optional)

---

## 🆘 Troubleshooting

### Gold prices not loading?
1. Check `GOLD_API_KEY` is set
2. Verify API rate limits (free: 100/day)
3. Check browser console for errors
4. Mock data will be used if API fails

### Payments failing?
1. Verify API keys are correct (not test keys in production)
2. Check webhook configuration
3. Review error logs in provider dashboards
4. Ensure `NEXT_PUBLIC_BASE_URL` is correct

### Products not showing?
1. Verify products are published in Sanity Studio
2. Check products have required fields (name, slug, purity, weight)
3. Ensure images are uploaded
4. Run `npm run typegen` again

### Checkout errors?
1. Check cart has items
2. Verify stock availability
3. Ensure payment provider keys are valid
4. Check browser console and network tab

---

## 📚 Documentation Reference

- **Full Setup Guide:** [GOLD_TRADING_GUIDE.md](./GOLD_TRADING_GUIDE.md)
- **Implementation Details:** [GOLD_IMPLEMENTATION_SUMMARY.md](./GOLD_IMPLEMENTATION_SUMMARY.md)
- **Environment Variables:** [.env.example](./.env.example)

---

## 🎉 Launch Day Checklist

- [ ] All products published
- [ ] Prices verified
- [ ] Stock levels set
- [ ] Payment providers in production mode
- [ ] Webhooks configured and tested
- [ ] DNS pointed to deployment
- [ ] SSL certificate active
- [ ] Social media posts scheduled
- [ ] Email newsletter sent (if applicable)
- [ ] Customer support ready

---

## 🚀 You're Ready to Launch!

Once all items are checked, your gold trading platform is ready to accept real orders. Monitor the dashboards closely for the first few transactions.

**Need Help?**
- Stripe Support: https://support.stripe.com
- Coinbase Commerce: https://commerce.coinbase.com/docs
- Sanity Support: https://www.sanity.io/help

Good luck with your launch! 🎊
