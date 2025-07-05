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
} from "lucide-react";

// Internal imports
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
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
    label: "Webhooks support (soon)",
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
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(false);

  const { user } = useAuth();

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
          .maybeSingle();
        if (error) {
          console.error("Error checking premium status:", error);
          setHasPremium(false);
        } else if (data) {
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
    const timeout = setTimeout(() => setPurchaseLoading(false), 5000);
    return () => clearTimeout(timeout);
  };

  const primaryProduct = products[0];
  if (!primaryProduct) return null;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="flex flex-col items-center justify-center gap-16 py-28 px-8 text-center w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start text-left">
          <div className="flex flex-col gap-6 text-center lg:text-left">
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
          <div className="max-w-lg mx-auto lg:mx-0 w-full flex flex-col gap-6">
            <Card className="p-8 text-left border">
              <div className="flex flex-col gap-8">
                <Badge variant="secondary" className="bg-accent/50 w-fit">
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
                    href={user ? `/purchase/${PRODUCT_ID}` : "#"}
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
