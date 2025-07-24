"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 md:py-28 py-12 md:px-8 px-4 text-center w-full relative">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-18 relative">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 md:py-16 backdrop-blur-[0px] w-full rounded-card z-4 shadow-[inset_0px_-24px_66px_-11px_hsl(var(--hu-primary),0.1)]">
          <p className="text-5xl max-[414px]:text-4xl md:text-7xl tracking-tight leading-tight font-medium">
            Ready to create beautiful forms?
          </p>
          <p className="md:text-lg mx-auto">
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
