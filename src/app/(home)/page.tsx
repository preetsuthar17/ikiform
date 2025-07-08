import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing/pricing";
import Features from "@/components/home/features";
import FAQSection from "@/components/home/faq-section";

import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Separator />
        <Features />
        <Separator />
      </main>
    </>
  );
}
