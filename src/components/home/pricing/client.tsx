"use client";

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
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const PRODUCT_ID = "2e9b8531-0d45-40df-be1c-65482eefeb85";

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
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
      className="flex flex-col items-center justify-center gap-12 md:py-28 py-12 md:px-8 px-4 text-center w-full"
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-18">
        <div className="flex flex-col items-center gap-4 px-6">
          <h2 className="text-3xl md:text-4xl font-semibold">Pricing</h2>
          <p className="text-md text-muted-foreground max-w-xl mx-auto">
            Simple, transparent pricing. Everything you need to build beautiful
            forms. Start free, upgrade when you need more features.
          </p>
        </div>
        <div
          className="w-full max-w-7xl mx-auto flex flex-col items-center grow text-left rounded-card md:p-12 p-4"
          style={{
            backgroundImage: `url(/pricing-bg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Card className="w-full p-0 border shadow-md/3 overflow-hidden">
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex flex-col gap-8 md:w-1/2 w-full p-8 items-start justify-start ">
                <Badge variant="secondary" className="w-fit mr-auto">
                  🎉 Get Early Bird Discount
                </Badge>
                <div className="flex flex-col gap-3 items-center">
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
              </div>
              <div className="flex flex-col gap-8 md:w-1/2 w-full p-8">
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
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
