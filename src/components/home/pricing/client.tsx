"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";

interface Product {
  id: string;
  name: string;
}

interface PricingClientProps {
  products: Product[];
}

const features = [
  "Unlimited submissions",
  "Advanced analytics",
  "Exporting responses",
  "Integrations",
  "Fully customizable",
  "Webhooks support (soon)",
  "Priority support",
  "and more...",
];

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(false);

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

          {/* Right Side - Pricing Card */}
          <div ref={cardRef} className="max-w-lg mx-auto lg:mx-0 w-full">
            <Card className="p-8 text-left border">
              <div className="flex flex-col gap-8">
                {/* Early Bird Discount Badge */}
                <div>
                  <Badge variant="secondary" className="bg-accent/50 w-fit">
                    🎉 Get Early Bird Discount
                  </Badge>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-muted-foreground line-through">
                      $29
                    </span>
                    <span className="text-4xl font-bold text-foreground">
                      $19
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {user && hasPremium ? (
                  <div className="space-y-3">
                    <Link href="/dashboard" className="w-full block">
                      <Button size="lg" className="w-full">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Go to Dashboard
                        </div>
                      </Button>
                    </Link>
                    <Link
                      href="/portal"
                      target="_blank"
                      className="w-full block"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/checkout?products=${primaryProduct.id}&customerEmail=${user?.email}`}
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
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
