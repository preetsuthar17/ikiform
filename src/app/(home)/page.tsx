import Hero from "@/components/home/hero";
import Features from "@/components/home/features";

import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Separator />
        <Features />
      </main>
    </>
  );
}
