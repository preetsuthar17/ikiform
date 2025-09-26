import BentoFeatures from "@/components/home/bento-features";
import CTA from "@/components/home/cta";
import FaqSection from "@/components/home/faq";
import {
  FeatureOne,
  FeatureThree,
  FeatureTwo,
} from "@/components/home/features";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing/pricing";
import PromoPopup from "@/components/home/promo-popup";
import Review from "@/components/other/reivew";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center gap-24">
        <Hero />
        <Review
          image="https://api.dicebear.com/9.x/glass/svg?seed=TrustFObe"
          name="Trust F. Òbe"
          review={`Very nice work with Ikiform.

I was immediately sold when I saw your article about Typeform being too expensive. `}
        />
        <FeatureOne />
        <FeatureTwo />
        <FeatureThree />
        <BentoFeatures />
        <Pricing />
        <FaqSection />
        <Review
          image="https://pbs.twimg.com/profile_images/1929279033180618752/0z6QXRbm_400x400.jpg"
          name="Kais"
          review={`I really love this, I'm going to use it for my design studio! 

The AI is really neat I just got a form up in no time, and it just has built-in rate limiting and content filtering that's INSANE!`}
          role="Design Agency Founder"
        />
        <CTA />
      </main>
      <PromoPopup />
    </>
  );
}
