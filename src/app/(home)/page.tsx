import BentoFeatures from '@/components/home/bento-features';
import Hero from '@/components/home/hero';
import Pricing from '@/components/home/pricing/pricing';
import Review from '@/components/other/reivew';

export default function Home() {
  return (
    <main className='flex flex-col gap-12 items-center'>
      <Hero />
         <Review
        image="https://api.dicebear.com/9.x/glass/svg?seed=TrustFObe"
        name="Trust F. Òbe"
        review={`Very nice work with Ikiform.

I was immediately sold when I saw your article about Typeform being too expensive. `}
      />
      <BentoFeatures />
      <Pricing />
       <Review
        image="https://pbs.twimg.com/profile_images/1929279033180618752/0z6QXRbm_400x400.jpg"
        name="Kais"
        role='Design Agency Founder'
        review={`I really love this, I'm going to use it for my design studio! 

The AI is really neat I just got a form up in no time, and it just has built-in rate limiting and content filtering that's INSANE!`}
      />  
    </main>
  );
}
