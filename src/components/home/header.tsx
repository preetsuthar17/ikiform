'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  AlignJustify,
  ChevronRight,
  LogIn,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

function DrawerNavLink({
  href,
  children,
  icon,
  onClick,
  isButton = false,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  isButton?: boolean;
  className?: string;
}) {
  if (isButton) {
    return (
      <Button
        asChild
        className={`rounded-full border border-[0.5px] hover:brightness-99 ${className}`}
        onClick={onClick}
        variant="secondary"
      >
        <Link
          className="flex items-center gap-2 px-5 py-5 font-medium"
          href={href}
        >
          {icon}
          {children}
        </Link>
      </Button>
    );
  }
  return (
    <Link
      className={`flex w-full items-center gap-2 rounded-lg py-2 opacity-60 transition-opacity hover:opacity-100 ${className}`}
      href={href}
      onClick={onClick}
      tabIndex={0}
    >
      {icon}
      {children}
    </Link>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  function handleToggle() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <Button
      asChild
      className="relative overflow-hidden rounded-full border border-[0.5px] hover:brightness-99"
      onClick={handleToggle}
      size="icon"
      variant="secondary"
    >
      <span className="relative flex items-center justify-center gap-2 px-5 py-5 font-medium">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              animate={{
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              className="absolute"
              exit={{
                x: 40,
                y: 20,
                rotate: 180,
                opacity: 0,
              }}
              initial={{
                x: -40,
                y: -20,
                rotate: -180,
                opacity: 0,
              }}
              key="sun"
              transition={{
                duration: 0.2,
                ease: [0.6, 0, 0.4, 1],
                opacity: { duration: 0.15 },
              }}
            >
              <Sun className="h-5 w-5 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              animate={{
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              className="absolute"
              exit={{
                x: -40,
                y: -20,
                rotate: -180,
                opacity: 0,
              }}
              initial={{
                x: 40,
                y: 20,
                rotate: 180,
                opacity: 0,
              }}
              key="moon"
              transition={{
                duration: 0.2,
                ease: [0.6, 0, 0.4, 1],
                opacity: { duration: 0.15 },
              }}
            >
              <Moon className="h-5 w-5 text-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </Button>
  );
}
export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="mx-auto mt-12 flex w-full max-w-7xl flex-wrap items-center justify-between gap-8 p-4 font-inter text-sm">
      <div className="flex flex-1 flex-shrink-0 items-center justify-start gap-2">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
            <Image
              alt="Ikiform Logo"
              className="dark:invert"
              height={36}
              src="/favicon.ico"
              width={36}
            />
            <span className="font-dm-sans font-semibold text-2xl tracking-tight">
              Ikiform
            </span>
          </span>
        </Link>
      </div>
      <div className="hidden items-center space-x-8 md:flex">
        <Link
          className="text-sm opacity-70 transition-opacity hover:opacity-100"
          href="/"
        >
          Home
        </Link>
        <Link
          className="transition- text-sm opacity-70 hover:opacity-100"
          href="/#features"
        >
          Features
        </Link>
        <Link
          className="transition- text-sm opacity-70 hover:opacity-100"
          href="/feedback"
        >
          Feedback
        </Link>
        <Link
          className="transition- text-sm opacity-70 hover:opacity-100"
          href="/#pricing"
        >
          Pricing
        </Link>
      </div>
      <div className="hidden flex-1 justify-end gap-1 md:flex">
        <ThemeToggleButton />
        {user ? (
          <Button
            asChild
            className="rounded-full border border-[0.5px] hover:brightness-99"
            variant="secondary"
          >
            <Link
              className="flex items-center gap-2 px-5 py-5 font-medium"
              href="/dashboard"
            >
              Dashboard
              <ChevronRight />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            className="rounded-full border border-[0.5px] hover:brightness-99"
            variant="secondary"
          >
            <Link
              className="flex items-center gap-2 px-5 py-5 font-medium"
              href="/login"
            >
              Login
            </Link>
          </Button>
        )}
      </div>
      <div className="flex items-center md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button aria-label="open-sidebar" size="icon" variant="ghost">
              <span className="sr-only">Open sidebar</span>
              <AlignJustify className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col gap-6 p-6 pt-10">
            <VisuallyHidden>
              <DrawerTitle>Navigation Menu</DrawerTitle>
            </VisuallyHidden>
            <VisuallyHidden>
              <DrawerDescription>
                Main navigation links and user actions for Ikiform.
              </DrawerDescription>
            </VisuallyHidden>
            <div className="flex w-full flex-col items-center gap-4">
              <nav className="flex w-full flex-col">
                <DrawerNavLink href="/">Home</DrawerNavLink>
                <DrawerNavLink href="/#features">Features</DrawerNavLink>
                <DrawerNavLink href="/#pricing">Pricing</DrawerNavLink>
                <DrawerNavLink href="/feedback">Feedback</DrawerNavLink>
              </nav>
              <div className="flex w-full flex-col">
                {user ? (
                  <DrawerNavLink
                    href="/dashboard"
                    icon={<User className="h-4 w-4" />}
                    isButton
                  >
                    Dashboard
                  </DrawerNavLink>
                ) : (
                  <DrawerNavLink
                    href="/login"
                    icon={<LogIn className="h-4 w-4" />}
                    isButton
                  >
                    Login
                  </DrawerNavLink>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
