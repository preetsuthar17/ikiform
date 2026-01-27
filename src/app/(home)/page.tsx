import BentoFeatures from "@/components/home/bento-features";
import CTA from "@/components/home/cta";
import FaqSection from "@/components/home/faq";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing/pricing";

export default function Home() {
	return (
		<>
			<main className="flex flex-col items-center">
				<Hero />
				<BentoFeatures />
				<Pricing />
				<FaqSection />
				<CTA />
			</main>
			{/* <PromoPopup /> */}
		</>
	);
}
