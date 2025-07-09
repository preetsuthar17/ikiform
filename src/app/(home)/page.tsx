import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import FAQSection from "@/components/home/faq-section";
import Pricing from "@/components/home/pricing/pricing";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
