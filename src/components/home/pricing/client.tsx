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
import { useAuth } from '@/hooks/use-auth';
import { usePremiumStatus } from '@/hooks/use-premium-status';
import FeatureComparisonTable from './feature-comparison-table';

interface Product {
  id: string;
  name: string;
}

interface PricingClientProps {
  products: Product[];
}

const features = [
  {
    label: 'Unlimited submissions',
    icon: <FileText className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'Advanced analytics',
    icon: <BarChart3 className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'AI Form builder',
    icon: <Bot className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'AI Analytics',
    icon: <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'Exporting responses',
    icon: <Share2 className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'Integrations',
    icon: <Network className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'Webhook',
    icon: <Zap className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
  {
    label: 'Priority support',
    icon: <Star className="h-4 w-4 flex-shrink-0 text-primary" />,
  },
];

const MONTHLY_PRODUCT_ID = '05f52efa-2102-4dd0-9d1d-1538210d6712';
const YEARLY_PRODUCT_ID = '4eff4c1d-56de-4111-96de-b5ec8124dd4b';

const PRICING = {
  monthly: {
    price: 29,
    originalPrice: 39,
    period: 'month',
    billedAs: '$29/month',
    savings: null,
  },
  yearly: {
    price: 19,
    originalPrice: 29,
    period: 'month',
    billedAs: 'Billed yearly as $228',
    savings: Math.round((1 - (19 * 12) / (29 * 12)) * 100),
  },
};

export default function PricingClient({ products }: PricingClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
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

  const handleBillingToggle = (checked: boolean) => {
    setBillingPeriod(checked ? 'yearly' : 'monthly');
  };

  const currentPricing = PRICING[billingPeriod];
  const productId =
    billingPeriod === 'monthly' ? MONTHLY_PRODUCT_ID : YEARLY_PRODUCT_ID;

  const primaryProduct = products[0];
  if (!primaryProduct) return null;

  return (
    <section
      className="flex w-full flex-col items-center justify-center gap-12 px-4 py-12 text-center md:px-8 md:py-28"
      id="pricing"
      ref={sectionRef}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-18">
        <div className="flex flex-col items-center gap-4 px-6">
          <h2 className="font-semibold text-3xl md:text-4xl">Pricing</h2>
          <p className="mx-auto max-w-xl text-md text-muted-foreground">
            Simple, transparent pricing. Everything you need to build beautiful
            forms. Start free, upgrade when you need more features.
          </p>

          {}
          <div className="mt-6 flex items-center gap-4">
            <span
              className={`text-sm ${billingPeriod === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingPeriod === 'yearly'}
              className="data-[state=checked]:bg-primary"
              onCheckedChange={handleBillingToggle}
            />
            <span
              className={`text-sm ${billingPeriod === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
            >
              Yearly
            </span>
            <Badge
              className="ml-2 border-green-200 bg-green-100 text-green-700"
              variant="secondary"
            >
              Save 34%
            </Badge>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl grow flex-col items-center rounded-card p-4 text-left md:p-12">
          {}
          <div className="pointer-events-none absolute inset-0 z-2 rounded-card bg-black/15 backdrop-blur-[5px]" />

          <OptimizedImage
            alt={'Pricing background image'}
            className="absolute inset-0 z-0 h-full w-full rounded-card object-cover"
            height={1080}
            src={
              'https://av5on64jc4.ufs.sh/f/jYAIyA6pXignjTkuSWpXignmaOlP5cRt3oEBh7bKq40kjD9L'
            }
            width={1920}
          />
          <Card className="z-5 w-full overflow-hidden border p-0 shadow-md/3">
            <div className="flex w-full flex-col md:flex-row">
              <div className="flex w-full flex-col items-start justify-start gap-8 p-8 md:w-1/2 ">
                <Badge className="mr-auto w-fit" variant="secondary">
                  🎉 Get Early Bird Discount
                </Badge>

                {}
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-medium text-2xl text-muted-foreground line-through">
                      ${currentPricing.originalPrice}
                    </span>
                    <span className="font-bold text-4xl text-foreground">
                      ${currentPricing.price}
                    </span>
                    <span className="text-muted-foreground">
                      per {currentPricing.period}
                    </span>
                  </div>

                  {}
                  <div className="flex flex-col gap-2">
                    {billingPeriod === 'yearly' && (
                      <div className="text-muted-foreground text-sm">
                        {currentPricing.billedAs}
                      </div>
                    )}
                    {currentPricing.savings && (
                      <div className="flex items-center gap-2">
                        <Badge
                          className="border-green-200 font-medium text-green-600 text-xs"
                          variant="outline"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Save {currentPricing.savings}% vs monthly
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {}
                {user && hasPremium ? (
                  <div className="w-full space-y-3">
                    <Button className="w-full" size="lg">
                      <Link
                        className="block w-full"
                        href="/dashboard"
                        target="_blank"
                      >
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button className="w-full" size="sm" variant="outline">
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
                        : '#'
                    }
                    onClick={handlePurchaseClick}
                  >
                    <Button
                      className="w-full"
                      disabled={purchaseLoading || checkingPremium}
                      size="lg"
                    >
                      {purchaseLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-card border-2 border-current border-t-transparent" />
                          Processing...
                        </div>
                      ) : checkingPremium ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-card border-2 border-current border-t-transparent" />
                          Checking...
                        </div>
                      ) : user ? (
                        'Get started with Ikiform'
                      ) : (
                        'Sign In to Get Started'
                      )}
                    </Button>
                  </Link>
                )}

                {}
                <div className="w-full text-center">
                  <p className="text-muted-foreground text-xs">
                    {billingPeriod === 'yearly'
                      ? 'Billed annually • Cancel anytime'
                      : 'Billed monthly • Cancel anytime'}
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-6 p-8 md:w-1/2">
                <div className="mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Premium Features</span>
                </div>

                <div className="flex flex-col gap-3">
                  {features.map((feature, index) => (
                    <div className="flex items-center gap-3" key={index}>
                      {feature.icon}
                      <span className="text-foreground text-sm">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <FeatureComparisonTable />
          </Card>
        </div>
      </div>
    </section>
  );
}
