"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { OptimizedImage } from "../other/optimized-image";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 md:py-28 py-12 md:px-8 px-4 text-center w-full relative">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-18 relative">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-card z-2 backdrop-blur-[1px]" />

        <OptimizedImage
          src={"https://av5on64jc4.ufs.sh/f/jYAIyA6pXign3ME7HreLQ4dr2ZgV83EaAYobCju17ih06NpT"}
          alt={"CTA background image"}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover rounded-card z-0"
        />
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 md:py-16 backdrop-blur-[0px] w-full rounded-card z-4 ">
          <p className="text-5xl max-[414px]:text-4xl md:text-7xl tracking-tight leading-tight text-white font-medium">
            Ready to create beautiful forms?
          </p>
          <p className="md:text-lg text-white  mx-auto">
            Get started with Ikiform and build your first form in seconds.
          </p>
          <Button size="lg" className="font-medium h-[45px] mt-6" asChild>
            <Link href="/login">Create your first form</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
