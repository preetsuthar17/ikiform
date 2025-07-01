import { api } from "@/lib/polar";
import PricingClient from "./pricing/client";

export default async function Pricing() {
  const products = await api.products.list({ isArchived: false });

  return (
    <>
      <section>
        <h2>Pricing</h2>
        <PricingClient products={products.result.items} />
      </section>
    </>
  );
}
