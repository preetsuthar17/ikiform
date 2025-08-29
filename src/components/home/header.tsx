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

export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="mx-auto mt-12 flex w-full max-w-7xl flex-wrap items-center justify-between gap-8 p-4 font-inter text-sm">
      <div className="flex flex-1 flex-shrink-0 items-center justify-start gap-2">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
            <Image
              alt="Ikiform Logo"
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
      <div className="hidden items-center gap-8 md:flex">
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
