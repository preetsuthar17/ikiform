'use client';

import {
  BarChart3,
  Bot,
  Check,
  Clock,
  Crown,
  FileText,
  Flag,
  Network,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { OptimizedImage } from '@/components/other/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { usePremiumStatus } from '@/hooks/use-premium-status';

interface Product {
  id: string;
  name: string;
}

interface PricingClientProps {
  products: Product[];
}

const features = [
  'Unlimited forms and submissions',
  'AI Form builder and AI analytics',
  'Scoring (quiz system)',
  'Webhooks',
  'Fetching form field data from API',
  'Collect signature',
  'File upload field',
  'Form embedding',
  'Design customization & custom branding',
  'and much more!',
];

const MONTHLY_PRODUCT_ID = '05f52efa-2102-4dd0-9d1d-1538210d6712';
const YEARLY_PRODUCT_ID = '4eff4c1d-56de-4111-96de-b5ec8124dd4b';
const ONETIME_PRODUCT_ID = '2e9b8531-0d45-40df-be1c-65482eefeb85';

const PRICING: {
  monthly: {
    price: number;
    originalPrice: number;
    period: string;
    billedAs: string;
    savings: number | null;
  };
  yearly: {
    price: number;
    originalPrice: number;
    period: string;
    billedAs: string;
    savings: number | null;
  };
  onetime: {
    price: number;
    originalPrice: number;
    period: string;
    billedAs: string;
    savings: number | null;
  };
} = {
  monthly: {
    price: 19,
    originalPrice: 29,
    period: '/Mo',
    billedAs: 'Billed monthly • Cancel anytime',
    savings: null,
  },
  yearly: {
    price: 9,
    originalPrice: 19,
    period: '/Mo',
    billedAs: 'Billed annually • Cancel anytime',
    savings: null,
  },
  onetime: {
    price: 119,
    originalPrice: 139,
    period: '',
    billedAs: 'One-time payment • Lifetime access',
    savings: null,
  },
};

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<
    'monthly' | 'yearly' | 'onetime'
  >('monthly');
  const { user } = useAuth();
  const { hasPremium, checkingPremium } = usePremiumStatus(user);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setPurchaseLoading(false);
  }, [user]);

  const handlePurchaseClick = () => {
    setPurchaseLoading(true);
    const timeout = setTimeout(() => setPurchaseLoading(false), 5000);
    return () => clearTimeout(timeout);
  };

  const currentPricing = PRICING[billingPeriod];
  const productId =
    billingPeriod === 'monthly'
      ? MONTHLY_PRODUCT_ID
      : billingPeriod === 'yearly'
        ? YEARLY_PRODUCT_ID
        : ONETIME_PRODUCT_ID;

  const primaryProduct = products[0];
  if (!primaryProduct) return null;

  return (
    <section
      className="mx-auto w-full max-w-7xl bg-background"
      id="pricing"
      ref={sectionRef}
    >
      <div className="mx-auto flex w-full flex-col">
        <div className="mx-auto flex w-full flex-col gap-18 px-4 md:px-8">
          <div className="flex flex-col gap-8 text-center">
            <p className="text-center text-base text-muted-foreground md:text-lg">
              Pricing{' '}
            </p>
            <h2 className="mx-auto max-w-2xl text-center font-dm-sans font-medium text-2xl text-foreground leading-normal tracking-tight md:text-3xl lg:text-4xl">
              Simple, transparent pricing. Everything you need to build
              beautiful forms
            </h2>
          </div>
          <div className="rounded-3xl bg-card p-8 md:p-12">
            <div className="flex flex-col gap-12">
              {/* 2x1 Grid with equal width sides */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left side - Pricing options with testimonial */}
                <div className="rounded-3xl bg-card">
                  <div className="flex h-full flex-col gap-8">
                    {/* Pricing options */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                      {/* Monthly Option */}
                      <div
                        aria-pressed={billingPeriod === 'monthly'}
                        className={`cursor-pointer rounded-2xl p-4 transition-all sm:rounded-3xl sm:p-6 ${
                          billingPeriod === 'monthly'
                            ? 'bg-card outline-2 outline-border'
                            : 'bg-background outline-2 outline-transparent'
                        }`}
                        onClick={() => setBillingPeriod('monthly')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-base text-foreground sm:text-lg">
                              Monthly
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Billed monthly • Cancel anytime
                            </p>
                          </div>
                          <div className="mt-1 xs:mt-0 flex items-baseline gap-1 sm:gap-2">
                            <span className="text-muted-foreground text-xs line-through sm:text-sm">
                              $29
                            </span>
                            <span className="font-medium text-foreground text-xl sm:text-2xl">
                              $19
                            </span>
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              /Mo
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Yearly Option */}
                      <div
                        aria-pressed={billingPeriod === 'yearly'}
                        className={`cursor-pointer rounded-2xl p-4 transition-all sm:rounded-3xl sm:p-6 ${
                          billingPeriod === 'yearly'
                            ? 'bg-card outline-2 outline-border'
                            : 'bg-background outline-2 outline-transparent'
                        }`}
                        onClick={() => setBillingPeriod('yearly')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-base text-foreground sm:text-lg">
                              Yearly
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Billed annually • Cancel anytime
                            </p>
                          </div>
                          <div className="mt-1 xs:mt-0 flex items-baseline gap-1 sm:gap-2">
                            <span className="text-muted-foreground text-xs line-through sm:text-sm">
                              $19
                            </span>
                            <span className="font-medium text-foreground text-xl sm:text-2xl">
                              $9
                            </span>
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              /Mo
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Lifetime Option */}
                      <div
                        aria-pressed={billingPeriod === 'onetime'}
                        className={`cursor-pointer rounded-2xl p-4 transition-all sm:rounded-3xl sm:p-6 ${
                          billingPeriod === 'onetime'
                            ? 'bg-card outline-2 outline-border'
                            : 'bg-background outline-2 outline-transparent'
                        }`}
                        onClick={() => setBillingPeriod('onetime')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-base text-foreground sm:text-lg">
                              Lifetime
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              One-time payment • Lifetime access
                            </p>
                          </div>
                          <div className="mt-1 xs:mt-0 flex items-baseline gap-1 sm:gap-2">
                            <span className="text-muted-foreground text-xs line-through sm:text-sm">
                              $139
                            </span>
                            <span className="font-medium text-foreground text-xl sm:text-2xl">
                              $119
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial at bottom */}
                    <div className="mt-auto">
                      <div className="rounded-3xl bg-background p-4 sm:p-6">
                        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                          <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-lg text-primary-foreground sm:mx-0">
                            T
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <h4 className="font-medium text-foreground">
                                Trust F. Obe
                              </h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    key={i}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-foreground">
                              Very nice work with Ikiform. I was immediately
                              sold when I saw your article about Typeform being
                              too expensive.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Main pricing card */}
                <div className="rounded-3xl bg-background p-4 sm:p-6">
                  <div className="flex h-full flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-medium text-2xl text-foreground">
                        {billingPeriod === 'monthly'
                          ? 'Monthly'
                          : billingPeriod === 'yearly'
                            ? 'Yearly'
                            : 'Lifetime'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {currentPricing.billedAs}
                      </p>
                    </div>

                    <div className="flex flex-grow flex-col gap-8 rounded-3xl bg-card p-4 sm:p-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-lg text-muted-foreground line-through">
                          ${currentPricing.originalPrice}
                        </span>
                        <span className="font-medium text-4xl text-foreground">
                          ${currentPricing.price}
                        </span>
                        <span className="text-muted-foreground">
                          {currentPricing.period}
                        </span>
                      </div>
                      {/* Features */}
                      <div className="flex flex-col gap-3 md:gap-2">
                        {features.map((feature, index) => (
                          <div className="flex items-center gap-3" key={index}>
                            <span className="opacity-90">
                              <svg
                                height="22"
                                viewBox="0 0 20 20"
                                width="22"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            <span className="text-foreground text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="mt-auto flex flex-col gap-4">
                        {user && hasPremium ? (
                          <div className="flex flex-col gap-3">
                            <Button className="w-full rounded-full" size="lg">
                              <Link
                                className="block w-full"
                                href="/dashboard"
                                target="_blank"
                              >
                                Go to Dashboard
                              </Link>
                            </Button>
                            <Button
                              className="w-full rounded-full"
                              size="lg"
                              variant="outline"
                            >
                              <Link
                                className="block w-full"
                                href="/portal"
                                target="_blank"
                              >
                                Manage Subscription
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <Link
                            className="block w-full"
                            href={
                              user
                                ? `/checkout?products=${productId}&customerEmail=${user?.email}`
                                : '/login'
                            }
                            onClick={handlePurchaseClick}
                          >
                            <Button
                              className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                              disabled={purchaseLoading || checkingPremium}
                              size="lg"
                            >
                              {purchaseLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Processing...
                                </div>
                              ) : checkingPremium ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Checking...
                                </div>
                              ) : user ? (
                                'Purchase Plan →'
                              ) : (
                                'Sign In to Get Started'
                              )}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
