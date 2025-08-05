'use client';

import {
  Bot,
  GitBranch,
  Infinity,
  Mail,
  PenTool,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  preview: ReactNode;
  className?: string;
  featured?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  preview,
  className = '',
}: FeatureCardProps) => {
  return (
    <Card
      className={`overflow-hidden border border-border bg-card p-4 transition-all duration-300 ease-out hover:shadow-lg/2 ${className}`}
    >
      <div className="flex h-full w-full flex-col p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col items-start gap-4 text-left">
          <motion.div
            className="flex-shrink-0 rounded-ele bg-accent/50 p-2 text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {icon}
          </motion.div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 font-semibold text-foreground text-lg leading-tight">
              {title}
            </h3>
            <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full">{preview}</div>
        </div>
      </div>
    </Card>
  );
};

const AIFormBuilderPreview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  const steps = [
    { type: 'name', width: '50%', height: 'h-10' },
    { type: 'email', width: '40%', height: 'h-10' },
    { type: 'message', width: '60%', height: 'h-16' },
  ];

  const resetAndStart = useCallback(() => {
    setCurrentStep(0);
    setIsGenerating(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsGenerating(false);
        setTimeout(() => {
          resetAndStart();
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, resetAndStart, steps.length]);

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br from-accent/30 to-secondary/50 p-6">
      <div className="space-y-4">
        <motion.div
          animate={{ opacity: isGenerating ? 1 : 0.7 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{
              scale: isGenerating ? [1, 1.2, 1] : 1,
              opacity: isGenerating ? [0.5, 1, 0.5] : 1,
            }}
            className="h-3 w-3 rounded-card bg-primary"
            transition={{
              duration: 1,
              repeat: isGenerating
                ? globalThis.globalThis.Number.POSITIVE_INFINITY
                : 0,
              ease: 'easeInOut',
            }}
          />
          <span className="font-medium text-foreground text-sm">
            {isGenerating
              ? 'AI is generating your form...'
              : 'Form generated successfully!'}
          </span>
        </motion.div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              animate={{
                opacity: currentStep > index ? 1 : 0.3,
                y: currentStep > index ? 0 : -20,
              }}
              className="space-y-2"
              initial={{ opacity: 0, y: -20 }}
              key={index}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              <motion.div
                animate={{
                  width: currentStep > index ? step.width : '0%',
                  backgroundColor:
                    currentStep > index
                      ? 'hsl(var(--hu-primary))'
                      : 'hsl(var(--hu-border))',
                }}
                className="h-2 rounded-card bg-border"
                initial={{ width: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
              <motion.div
                animate={{
                  scale: currentStep > index ? 1 : 0.95,
                  opacity: currentStep > index ? 1 : 0.5,
                  borderColor:
                    currentStep > index
                      ? 'hsl(var(--hu-border))'
                      : 'hsl(var(--hu-border))',
                }}
                className={`rounded-ele border border-border bg-card ${step.height}`}
                initial={{ scale: 0.95, opacity: 0.5 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ opacity: currentStep >= steps.length ? 1 : 0.5 }}
        className="flex items-center justify-between border-border/50 border-t pt-4"
        initial={{ opacity: 0 }}
      >
        <span className="text-muted-foreground text-xs">Generated in 2.3s</span>
        <motion.div
          animate={{
            scale: currentStep >= steps.length ? 1 : 0.8,
            opacity: currentStep >= steps.length ? 1 : 0.5,
          }}
          className="rounded-card bg-primary px-3 py-1 text-primary-foreground text-xs"
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
        >
          Use this form
        </motion.div>
      </motion.div>
    </div>
  );
};

const UnlimitedPreview = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-card bg-gradient-to-t from-secondary to-accent/20 p-4">
      <div className="space-y-3 text-center">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          className="font-bold text-3xl text-primary"
          transition={{
            duration: 2,
            repeat: globalThis.Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          ∞
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-medium text-foreground text-sm">Submissions</div>
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            className="text-muted-foreground text-xs"
            transition={{
              duration: 2,
              repeat: globalThis.Number.POSITIVE_INFINITY,
            }}
          >
            Forms • Fields • Users
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ scale: 1 }}
          className="font-medium text-primary text-xs"
          initial={{ scale: 0 }}
          transition={{
            delay: 0.5,
            type: 'spring',
            stiffness: 300,
          }}
        >
          Forever Free
        </motion.div>
      </div>
    </div>
  );
};

const AnalyticsPreview = () => {
  const [isHovered, setIsHovered] = useState(false);
  const baseHeights = [45, 52, 48, 61, 55, 73, 68, 82, 76, 89];
  const [animatedHeights, setAnimatedHeights] = useState(baseHeights);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setAnimatedHeights(() =>
        Array.from(
          { length: baseHeights.length },
          () => Math.random() * 75 + 20
        )
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isHovered, baseHeights.length]);

  useEffect(() => {
    if (!isHovered) {
      setAnimatedHeights(baseHeights);
    }
  }, [isHovered]);

  return (
    <div
      className="h-full overflow-hidden rounded-card bg-gradient-to-br from-accent/20 to-secondary/30 p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground text-xs">
            Weekly Trends
          </span>
          <motion.span className="font-semibold text-green-500 text-xs">
            ↗ +34%
          </motion.span>
        </div>

        <div className="flex h-16 items-end gap-1">
          {animatedHeights.map((height, i) => (
            <motion.div
              animate={{
                height: `${height}%`,
              }}
              className="flex-1 rounded-ele bg-secondary"
              initial={{ height: 0 }}
              key={i}
              transition={{
                height: { duration: 0.5, ease: 'easeInOut' },
                backgroundColor: { duration: 0.3 },
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{
            opacity: isHovered ? [0.7, 1, 0.7] : 1,
          }}
          className="text-muted-foreground text-xs"
          transition={{
            duration: 1,
            repeat: isHovered ? globalThis.Number.POSITIVE_INFINITY : 0,
          }}
        >
          {isHovered ? 'Live data updating...' : '1.2k responses this week'}
        </motion.div>
      </div>
    </div>
  );
};

const LogicBuilderPreview = () => {
  const [showBranches, setShowBranches] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBranches(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full overflow-hidden rounded-card bg-gradient-to-r from-secondary/50 to-accent/30 p-4">
      <div className="space-y-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              boxShadow: showBranches
                ? '0 0 10px hsl(var(--hu-primary))'
                : 'none',
            }}
            className="flex h-4 w-4 items-center justify-center rounded-ele bg-primary"
            whileHover={{ scale: 1.2 }}
          >
            <div className="h-2 w-2 rounded-card bg-primary-foreground" />
          </motion.div>
          <span className="font-medium text-foreground text-xs">
            User selects "Yes"
          </span>
        </motion.div>

        <AnimatePresence>
          {showBranches && (
            <motion.div
              animate={{ opacity: 1, height: 'auto' }}
              className="ml-6 space-y-2"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {[
                'Show email field',
                'Send notification',
                'Redirect to page',
              ].map((text, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 border-border border-l-2 pl-4"
                  initial={{ opacity: 0, x: -10 }}
                  key={text}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      delay: index * 0.2 + 0.5,
                      duration: 0.5,
                    }}
                  >
                    <GitBranch className="h-3 w-3 text-muted-foreground" />
                  </motion.div>
                  <span className="text-muted-foreground text-xs">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const APIIntegrationPreview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowData(true);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="h-full overflow-hidden rounded-card bg-gradient-to-t from-accent/20 to-secondary/40 p-4">
      <div className="space-y-3">
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{
              scale: isLoading ? [1, 1.5, 1] : 1,
              opacity: isLoading ? [0.5, 1, 0.5] : 1,
            }}
            className="h-2 w-2 rounded-card bg-primary"
            transition={{
              duration: 1,
              repeat: isLoading ? globalThis.Number.POSITIVE_INFINITY : 0,
            }}
          />
          <span className="font-medium text-foreground text-xs">
            api.stripe.com
          </span>
        </motion.div>

        <motion.div
          animate={{
            opacity: isLoading ? [0.5, 1, 0.5] : 0.7,
          }}
          className="text-muted-foreground text-xs"
          transition={{
            duration: 1.5,
            repeat: isLoading ? globalThis.Number.POSITIVE_INFINITY : 0,
          }}
        >
          {isLoading
            ? '↓ Fetching customer data...'
            : '✓ Data loaded successfully'}
        </motion.div>

        <AnimatePresence>
          {showData && (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="space-y-2 rounded-card border border-border bg-card p-3"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              {[
                { label: 'John Doe', delay: 0 },
                { label: 'john@acme.com', delay: 0.1 },
                { label: 'Premium Plan', delay: 0.2 },
              ].map((item, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xs ${index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                  initial={{ opacity: 0, x: -10 }}
                  key={item.label}
                  transition={{ delay: item.delay }}
                >
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DigitalSignaturesPreview = () => {
  const [isSigning, setIsSigning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const signTimer = setTimeout(() => {
      setIsSigning(true);
      setTimeout(() => {
        setIsSigning(false);
        setIsVerified(true);
      }, 2000);
    }, 1000);

    return () => clearTimeout(signTimer);
  }, []);

  return (
    <div className="h-full overflow-hidden rounded-card bg-gradient-to-br from-accent/30 to-secondary/20 p-4">
      <motion.div
        animate={{
          borderColor: isVerified
            ? 'hsl(var(--hu-primary))'
            : 'hsl(var(--hu-border))',
          backgroundColor: isVerified
            ? 'hsl(var(--hu-primary) / 0.05)'
            : 'transparent',
        }}
        className="flex h-full flex-col justify-center rounded-card border-2 border-border border-dashed p-3"
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2 text-center">
          <div className="font-medium text-foreground text-xs">
            {isSigning
              ? 'Signing...'
              : isVerified
                ? 'Signature Complete'
                : 'Sign Here'}
          </div>
        </div>

        <motion.svg
          animate={{ opacity: isSigning || isVerified ? 1 : 0.3 }}
          className="mt-3 h-8 w-full"
          initial={{ opacity: 0 }}
          viewBox="0 0 120 24"
        >
          <motion.path
            animate={{
              pathLength: isSigning ? 1 : isVerified ? 1 : 0,
              opacity: isSigning ? [0.5, 1, 0.5] : 1,
            }}
            d="M10,18 Q25,8 40,12 T70,10 T100,14"
            fill="none"
            initial={{ pathLength: 0 }}
            stroke="hsl(var(--hu-primary))"
            strokeWidth="2"
            transition={{
              pathLength: { duration: 2, ease: 'easeInOut' },
              opacity: {
                duration: 0.5,
                repeat: isSigning ? globalThis.Number.POSITIVE_INFINITY : 0,
              },
            }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

const EmailNotificationsPreview = () => {
  interface Notification {
    id: number;
    title: string;
    from: string;
    time: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const maxNotifications = 3;

  const emailTemplates = [
    { title: 'Contact Form', from: 'john@example.com', time: '2 minutes ago' },
    {
      title: 'Newsletter Signup',
      from: 'sarah@gmail.com',
      time: '5 minutes ago',
    },
    {
      title: 'Support Request',
      from: 'mike@company.com',
      time: '8 minutes ago',
    },
    { title: 'Feedback Form', from: 'lisa@startup.io', time: '12 minutes ago' },
    {
      title: 'Job Application',
      from: 'alex@portfolio.dev',
      time: '15 minutes ago',
    },
  ];

  const addNotification = useCallback(() => {
    const randomEmail =
      emailTemplates[Math.floor(Math.random() * emailTemplates.length)];
    const newNotification = {
      id: Date.now(),
      ...randomEmail,
      time: 'Just now',
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      addNotification();
    }, 1000);

    const interval = setInterval(() => {
      addNotification();
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [addNotification]);

  return (
    <div className="h-full overflow-hidden rounded-card bg-gradient-to-t from-secondary/40 to-accent/30 p-4">
      <div className="space-y-3">
        <motion.div
          animate={{
            scale: notifications.length > 0 ? [1, 1.05, 1] : 1,
          }}
          className="flex items-center gap-2"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{
              rotate: notifications.length > 0 ? [0, -10, 10, 0] : 0,
              scale: notifications.length > 0 ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <Mail className="h-4 w-4 text-primary" />
          </motion.div>
          <span className="font-medium text-foreground text-xs">
            New submission
          </span>
        </motion.div>

        <div className="relative h-40">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => (
              <motion.div
                animate={{
                  opacity: index < 3 ? 1 : 0,
                  y: index * 35,
                  scale: 1 - index * 0.05,
                  zIndex: notifications.length - index,
                  rotateZ: index * 1.5,
                }}
                className="absolute w-full space-y-1 rounded-card border border-border bg-card p-3 shadow-sm"
                exit={{
                  opacity: 0,
                  y: 150,
                  scale: 0.8,
                  rotateZ: 5,
                  transition: {
                    duration: 0.4,
                    ease: 'easeInOut',
                  },
                }}
                initial={{
                  opacity: 0,
                  y: -60,
                  scale: 0.9,
                  zIndex: notifications.length - index + 10,
                }}
                key={notification.id}
                style={{
                  transformOrigin: 'center top',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                  duration: 0.6,
                }}
              >
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium text-foreground text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  {notification.title}
                </motion.div>
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.2 }}
                >
                  From: {notification.from}
                </motion.div>
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.3 }}
                >
                  {notification.time}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function BentoFeatures() {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-12 px-4 py-12 text-center md:px-8 md:py-28"
      id="features"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-18">
        {/* Bento Grid */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4">
          {/* AI Form Builder - Large featured card */}
          <FeatureCard
            className="col-span-2 row-span-2 w-full"
            description="Generate complete forms instantly using natural language. Just describe what you need and watch AI create professional forms with smart field types and validation."
            featured={true}
            icon={<Bot className="h-6 w-6" />}
            preview={<AIFormBuilderPreview />}
            title="AI Form Builder"
          />

          {/* Unlimited Submissions */}
          <FeatureCard
            className="col-span-1"
            description="No limits on submissions, forms, or features. Scale without restrictions."
            icon={<Infinity className="h-5 w-5" />}
            preview={<UnlimitedPreview />}
            title="Unlimited Everything"
          />

          {/* Analytics */}
          <FeatureCard
            className="col-span-1"
            description="Get intelligent insights about your form performance and user behavior."
            icon={<TrendingUp className="h-5 w-5" />}
            preview={<AnalyticsPreview />}
            title="AI Analytics"
          />

          {/* Email Notifications */}
          <FeatureCard
            className="col-span-2"
            description="Automated email notifications and custom triggers for form submissions."
            icon={<Mail className="h-5 w-5" />}
            preview={<EmailNotificationsPreview />}
            title="Smart Notifications"
          />

          {/* API Integration */}
          <FeatureCard
            className="col-span-1"
            description="Connect to any API to populate fields or send data automatically."
            icon={<Zap className="h-5 w-5" />}
            preview={<APIIntegrationPreview />}
            title="API Integration"
          />

          {/* Digital Signatures */}
          <FeatureCard
            className="col-span-1"
            description="Collect legally binding digital signatures with built-in verification."
            icon={<PenTool className="h-5 w-5" />}
            preview={<DigitalSignaturesPreview />}
            title="Digital Signatures"
          />

          {/* Logic Builder */}
          <FeatureCard
            className="col-span-2"
            description="Create complex conditional flows with an intuitive drag-and-drop interface. Build smart forms that adapt to user responses."
            icon={<GitBranch className="h-5 w-5" />}
            preview={<LogicBuilderPreview />}
            title="Visual Logic Builder"
          />
        </div>
      </div>
    </div>
  );
}
