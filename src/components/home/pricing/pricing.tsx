import { api } from "@/lib/polar";
import PricingClient from "./client";

export default async function Pricing() {
  const products = await api.products.list({ isArchived: false });

  return <PricingClient products={products.result.items} />;
}
