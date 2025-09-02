import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="mx-auto w-full max-w-7xl bg-background">
      <div className="mx-auto flex w-full flex-col px-4 md:px-8">
        <div className="rounded-4xl bg-card p-8 py-12 md:p-12 md:py-16">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Main heading */}
            <div className="flex flex-col gap-6">
              <h2 className="font-dm-sans font-medium text-4xl text-foreground tracking-tighter md:text-5xl lg:text-6xl">
                Ready to create beautiful forms?
              </h2>
              <p className="text-center text-base text-muted-foreground md:text-lg">
                Get started with Ikiform and build your first form in seconds!
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Button
                asChild
                className="w-full rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit"
                variant="default"
              >
                <Link
                  className="flex items-center gap-2 font-medium"
                  href="/login"
                >
                  Create Your First Form <ChevronRight />
                </Link>
              </Button>
              <Button
                className="w-full rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit"
                variant="secondary"
              >
                <Link
                  className="flex items-center gap-2 font-medium"
                  href="/#pricing"
                >
                  Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
