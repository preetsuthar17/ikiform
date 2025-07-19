import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import FAQSection from "@/components/home/faq-section";
import Pricing from "@/components/home/pricing/pricing";
import CTASection from "@/components/home/cta-section";
import Review from "@/components/other/reivew";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Review
          name="Kais"
          review={`I really love this, I'm going to use it for my design studio! 

The AI is really neat I just got a form up in no time, and it just has built-in rate limiting and content filtering that's INSANE!`}
          role="Agency owner"
          image="https://pbs.twimg.com/profile_images/1929279033180618752/0z6QXRbm_400x400.jpg"
        />
        <Features />
        <Review
          name="Trust F. Òbe"
          review={`Very nice work with Ikiform.

I was immediately sold when I saw your article about Typeform being too expensive. `}
          image="https://api.dicebear.com/9.x/micah/svg?seed=TrustF"
        />
        <Pricing />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
