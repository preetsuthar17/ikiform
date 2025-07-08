import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import FAQSection from "@/components/home/faq-section";
import Pricing from "@/components/home/pricing/pricing";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQSection />
      </main>
    </>
  );
}
