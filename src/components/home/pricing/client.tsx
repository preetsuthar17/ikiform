"use client";

// External imports
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Crown,
  Bot,
  BarChart3,
  FileText,
  Zap,
  Share2,
  Network,
  Star,
  Sparkles,
  Flag,
  Clock,
  Smartphone,
} from "lucide-react";

// Internal imports
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, useScroll, useTransform } from "motion/react";

interface Product {
  id: string;
  name: string;
}

interface PricingClientProps {
  products: Product[];
}

const features = [
  {
    label: "Unlimited submissions",
    icon: <FileText className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Advanced analytics",
    icon: <BarChart3 className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "AI Form builder",
    icon: <Bot className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "AI Analytics",
    icon: <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Exporting responses",
    icon: <Share2 className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Integrations",
    icon: <Network className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Webhook",
    icon: <Zap className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Priority support",
    icon: <Star className="w-4 h-4 text-primary flex-shrink-0" />,
  },
];

const soonFeatures = [
  {
    label: "Team collaboration",
    icon: <Network className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Custom domains",
    icon: <Star className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Flagging responses",
    icon: <Flag className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Integrations",
    icon: <Network className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Webhooks",
    icon: <Zap className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Logic builder",
    icon: <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Fetching form field data from API",
    icon: <Share2 className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Time input field",
    icon: <Clock className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "File uploads (in few days)",
    icon: <FileText className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Mobile builder",
    icon: <Smartphone className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Advance form customization",
    icon: <Crown className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "and more",
    icon: <Star className="w-4 h-4 text-primary flex-shrink-0" />,
  },
];

const PRODUCT_ID = "2e9b8531-0d45-40df-be1c-65482eefeb85";

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { user } = useAuth();
  const { hasPremium, checkingPremium } = usePremiumStatus(user);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start center", "end center"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.5, 5], [0, 0, 300]);

  const handlePurchaseClick = () => {
    setPurchaseLoading(true);
    const timeout = setTimeout(() => setPurchaseLoading(false), 5000);
    return () => clearTimeout(timeout);
  };

  const primaryProduct = products[0];
  if (!primaryProduct) return null;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="flex flex-col items-center justify-center gap-16 md:py-28 py-12 md:px-8 px-4 text-center w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start text-left">
          <motion.div
            ref={headerRef}
            className={`flex flex-col gap-6 ${
              isMobile
                ? "text-center lg:text-left relative"
                : "sticky top-8 h-fit"
            }`}
            style={!isMobile ? { y: headerY } : {}}
          >
            <Badge
              variant="secondary"
              className="px-4 py-2 w-fit  max-[1024px]:mx-auto"
            >
              Pricing
            </Badge>
            <h2 className="text-3xl font-medium">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground">
              Everything you need to build beautiful forms. Start free, upgrade
              when you need more features.
            </p>
          </motion.div>
          <div className="max-w-lg mx-auto lg:mx-0 w-full flex flex-col gap-6">
            <Card className="p-8 text-left border bg-transparent shadow-md/3">
              <div className="flex flex-col gap-8">
                <Badge variant="secondary" className="w-fit">
                  🎉 Get Early Bird Discount
                </Badge>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-muted-foreground line-through">
                      $49
                    </span>
                    <span className="text-4xl font-bold text-foreground">
                      $39
                    </span>
                    <span className="text-muted-foreground">one-time</span>
                  </div>
                </div>
                {user && hasPremium ? (
                  <Button size="lg" className="w-full">
                    <Link
                      href="/dashboard"
                      target="_blank"
                      className="w-full block"
                    >
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Link
                    href={
                      user
                        ? `/checkout?products=${PRODUCT_ID}&customerEmail=${user?.email}`
                        : "#"
                    }
                    className="w-full block"
                    onClick={handlePurchaseClick}
                  >
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={purchaseLoading || checkingPremium}
                    >
                      {purchaseLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : checkingPremium ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Checking...
                        </div>
                      ) : user ? (
                        "Get Started"
                      ) : (
                        "Sign In to Get Started"
                      )}
                    </Button>
                  </Link>
                )}
                <Separator ChildrenClassName="bg-card">Features</Separator>
                <div className="flex flex-col gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.icon}
                      <span className="text-sm text-foreground">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator ChildrenClassName="bg-card">
                  Upcoming features
                </Separator>
                <div className="flex flex-col gap-3 mt-0">
                  {soonFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.icon}
                      <span className="text-sm text-foreground">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
