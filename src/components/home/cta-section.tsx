"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-12 px-4 py-12 text-center md:px-8 md:py-28">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-18">
        <div className="z-4 flex w-full flex-col items-center justify-center gap-3 rounded-card px-6 py-12 shadow-[inset_0px_-24px_66px_-11px_hsl(var(--hu-home-card-bg),0.1)] backdrop-blur-[0px] md:py-16">
          <p className="font-medium text-5xl leading-tight tracking-tight max-[414px]:text-4xl md:text-7xl">
            Ready to create beautiful forms?
          </p>
          <p className="mx-auto md:text-lg">
            Get started with Ikiform and build your first form in seconds.
          </p>
          <Button asChild className="mt-6 h-[45px] font-medium" size="lg">
            <Link href="/login">Create your first form</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
