// Live gold price service using Metal Price API
// Using metalpriceapi.com - Completely FREE: 100 requests/month, no credit card required
// Get your free key at: https://metalpriceapi.com

export interface GoldPrice {
  timestamp: number;
  price: number; // Price per troy ounce in USD
  currency: string;
  unit: string;
}

export interface GoldPriceHistory {
  date: string;
  price: number;
}

// Exchange rates (simplified - in production use a real API)
const EXCHANGE_RATES = {
  USD_TO_GBP: 0.79,
  USD_TO_EUR: 0.92,
};

/**
 * Fetch current gold spot price
 * Using metalpriceapi.com (100% free - 100 requests/month)
 * Get your key at: https://metalpriceapi.com (no credit card required)
 */
export async function getCurrentGoldPrice(): Promise<GoldPrice> {
  try {
    const apiKey = process.env.METAL_PRICE_API_KEY;

    if (!apiKey) {
      // Fallback to mock data for development
      console.warn("METAL_PRICE_API_KEY not set, using mock data");
      return getMockGoldPrice();
    }

    // Metal Price API endpoint - returns gold price in grams, we'll convert to oz
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch gold price");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || "API request failed");
    }

    // Metal Price API returns rate as USD per gram of gold
    // We need to convert to USD per troy ounce (31.1035 grams)
    const goldRatePerGram = data.rates?.XAU;
    if (!goldRatePerGram) {
      throw new Error("Gold rate not found in response");
    }

    // Convert from USD per gram to USD per troy ounce
    const pricePerOz = goldRatePerGram * 31.1035;

    return {
      timestamp: data.timestamp * 1000 || Date.now(),
      price: pricePerOz,
      currency: "USD",
      unit: "oz",
    };
  } catch (error) {
    console.error("Error fetching gold price:", error);
    return getMockGoldPrice();
  }
}

/**
 * Fetch historical gold prices for charts
 * Note: Historical data requires paid Metal Price API plan
 * Using mock data for free tier
 */
export async function getGoldPriceHistory(
  days: number = 30,
): Promise<GoldPriceHistory[]> {
  try {
    const apiKey = process.env.METAL_PRICE_API_KEY;

    if (!apiKey) {
      return getMockGoldPriceHistory(days);
    }

    // Historical data requires paid plan on metalpriceapi.com
    // For free tier, use mock data with realistic variations
    return getMockGoldPriceHistory(days);
  } catch (error) {
    console.error("Error fetching gold price history:", error);
    return getMockGoldPriceHistory(days);
  }
}

/**
 * Convert gold price between currencies
 */
export function convertGoldPrice(
  price: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return price;

  if (fromCurrency === "USD" && toCurrency === "GBP") {
    return price * EXCHANGE_RATES.USD_TO_GBP;
  }

  if (fromCurrency === "USD" && toCurrency === "EUR") {
    return price * EXCHANGE_RATES.USD_TO_EUR;
  }

  return price;
}

/**
 * Calculate product price based on weight, purity, and premium
 */
export function calculateGoldProductPrice(
  spotPrice: number,
  weight: number,
  weightUnit: string,
  purity: string,
  premiumPercentage: number,
): number {
  // Convert weight to troy ounces
  let weightInOz = weight;
  if (weightUnit === "g") {
    weightInOz = weight / 31.1035;
  } else if (weightUnit === "kg") {
    weightInOz = (weight * 1000) / 31.1035;
  }

  // Apply purity multiplier
  const purityMultipliers: Record<string, number> = {
    "24k": 0.999,
    "22k": 0.916,
    "18k": 0.75,
    "14k": 0.583,
  };

  const purityFactor = purityMultipliers[purity] || 1;

  // Calculate base price
  const basePrice = spotPrice * weightInOz * purityFactor;

  // Apply premium
  const priceWithPremium = basePrice * (1 + premiumPercentage / 100);

  return priceWithPremium;
}

/**
 * Mock gold price for development/fallback
 */
function getMockGoldPrice(): GoldPrice {
  // Approximate current gold price (varies daily)
  const basePrice = 2050;
  const variation = Math.random() * 20 - 10; // ±10 variation

  return {
    timestamp: Date.now(),
    price: basePrice + variation,
    currency: "USD",
    unit: "oz",
  };
}

/**
 * Generate mock historical data
 */
function getMockGoldPriceHistory(days: number): GoldPriceHistory[] {
  const history: GoldPriceHistory[] = [];
  const basePrice = 2050;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Simulate price movement
    const variation = Math.sin(i / 5) * 50 + Math.random() * 20 - 10;

    history.push({
      date: date.toISOString().split("T")[0],
      price: basePrice + variation,
    });
  }

  return history;
}
