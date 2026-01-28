import { redirect } from "next/navigation";
import { SuccessClient } from "./SuccessClient";
import { getCheckoutSession } from "@/lib/actions/checkout";

export const metadata = {
  title: "Order Confirmed | eCommerceAI",
  description: "Your order has been placed successfully",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; charge_code?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const chargeCode = params.charge_code;

  // Handle Coinbase Commerce success (no session needed)
  if (chargeCode && !sessionId) {
    return <SuccessClient session={null} chargeCode={chargeCode} />;
  }

  // Handle Stripe success
  if (!sessionId) {
    redirect("/");
  }

  const result = await getCheckoutSession(sessionId);

  if (!result.success || !result.session) {
    redirect("/");
  }

  return <SuccessClient session={result.session} />;
}
