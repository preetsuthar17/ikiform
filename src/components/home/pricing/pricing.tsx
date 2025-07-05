// Internal imports
import { api } from "@/lib/services";
import PricingClient from "./client";

export default async function Pricing() {
  const products = await api.products.list({ isArchived: false });

  return <PricingClient products={products.result.items} />;
}
