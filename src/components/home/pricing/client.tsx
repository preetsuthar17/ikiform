"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  Bot,
  BarChart3,
  FileText,
  Zap,
  Share2,
  Settings,
  Network,
  Bell,
  Star,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";

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
    label: "Webhooks support (soon)",
    icon: <Zap className="w-4 h-4 text-primary flex-shrink-0" />,
  },
  {
    label: "Priority support",
    icon: <Star className="w-4 h-4 text-primary flex-shrink-0" />,
  },
];

const MONTHLY_ID = "06a5d759-3bf0-4824-9f34-91c96f0f7376";
const YEARLY_ID = "69f54c3d-ca06-4ca0-92ab-283459bce5e6";

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check user's premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.email) {
        setHasPremium(false);
        setCheckingPremium(false);
        return;
      }

      setCheckingPremium(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("has_premium")
          .eq("email", user.email)
          .single();

        if (!error && data) {
          setHasPremium(data.has_premium || false);
        } else {
          setHasPremium(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setHasPremium(false);
      } finally {
        setCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const handlePurchaseClick = () => {
    setPurchaseLoading(true);

    const timeout = setTimeout(() => {
      setPurchaseLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    setPurchaseLoading(false);
  }, [user]);

  const price = billing === "monthly" ? 19 : 10;
  const oldPrice = billing === "monthly" ? 29 : 19 * 12;
  const yearlySavings = 1 - (10 * 12) / (19 * 12);
  const percentOff = Math.round(yearlySavings * 100); // 47%
  const productId = billing === "monthly" ? MONTHLY_ID : YEARLY_ID;

  const primaryProduct = products[0];

  if (!primaryProduct) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="flex flex-col items-center justify-center gap-16 py-28 px-8 text-center w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start text-left">
          {/* Left Side - Header Content */}
          <div
            className={`flex flex-col gap-6 ${
              isMobile
                ? "text-center lg:text-left relative"
                : "sticky top-8 h-fit"
            }`}
          >
            <Badge variant="secondary" className="px-4 py-2 w-fit">
              <Crown className="w-3 h-3" />
              Pricing
            </Badge>
            <h2 className="text-3xl font-medium">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground">
              Everything you need to build beautiful forms. Start free, upgrade
              when you need more features.
            </p>
          </div>

          {/* Right Side - Pricing Card with Tabs */}
          <div className="max-w-lg mx-auto lg:mx-0 w-full flex flex-col gap-6">
            <Tabs
              items={[
                { id: "yearly", label: "Yearly" },
                { id: "monthly", label: "Monthly" },
              ]}
              value={billing}
              onValueChange={(v) => setBilling(v as "monthly" | "yearly")}
              variant="underline"
              className="mb-2 w-full"
            />
            <Card className="p-8 text-left border">
              <div className="flex flex-col gap-8">
                {/* Early Bird Discount Badge */}
                <div>
                  <Badge variant="secondary" className="bg-accent/50 w-fit">
                    🎉 Get Early Bird Discount
                  </Badge>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-muted-foreground line-through">
                      {billing === "monthly" ? "$29" : "$19"}
                    </span>
                    <span className="text-4xl font-bold text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {billing === "yearly" && (
                    <div className="text-xs text-green-600 font-medium flex flex-col gap-3">
                      Billed yearly as $120{" "}
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold w-fit"
                      >
                        Save {percentOff}%
                      </Badge>
                    </div>
                  )}
                </div>
                {/* CTA Button */}
                {user && hasPremium ? (
                  <div className="space-y-3">
                    <Button size="lg" className="w-full">
                      <Link
                        href="/portal"
                        target="_blank"
                        className="w-full block"
                      >
                        Manage Your Subscription
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Link
                    href={`/checkout?products=${productId}&customerEmail=${user?.email}`}
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
                {/* Features */}
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
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
