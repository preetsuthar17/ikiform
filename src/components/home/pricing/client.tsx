'use client';

import {
  BarChart3,
  Bot,
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

const PRODUCT_ID = '2e9b8531-0d45-40df-be1c-65482eefeb85';

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
        </div>
        <div className="relative mx-auto flex w-full max-w-7xl grow flex-col items-center rounded-card p-4 text-left md:p-12">
          {/* Overlay */}
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
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-medium text-2xl text-muted-foreground line-through">
                      $69
                    </span>
                    <span className="font-bold text-4xl text-foreground">
                      $59
                    </span>
                    <span className="text-muted-foreground">one-time</span>
                  </div>
                </div>
                {user && hasPremium ? (
                  <Button className="w-full" size="lg">
                    <Link
                      className="block w-full"
                      href="/dashboard"
                      target="_blank"
                    >
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Link
                    className="block w-full"
                    href={
                      user
                        ? `/checkout?products=${PRODUCT_ID}&customerEmail=${user?.email}`
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
                        'Get Started'
                      ) : (
                        'Sign In to Get Started'
                      )}
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex w-full flex-col gap-8 p-8 md:w-1/2">
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
