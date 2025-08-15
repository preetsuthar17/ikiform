'use client';

import { AlignJustify, ChevronRight, LogIn, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from '../ui/drawer';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

function DrawerNavLink({
  href,
  children,
  icon,
  onClick,
  isButton = false,
  className = '',
}: {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  isButton?: boolean
  className?: string
}) {
  if (isButton) {
    return (
      <Button
        asChild
        className={`rounded-full border border-[0.5px] hover:brightness-99 ${className}`}
        variant="secondary"
        onClick={onClick}
      >
        <Link className="flex items-center gap-2 font-medium px-5 py-5" href={href}>{icon}{children}</Link>
      </Button>
    );
  }
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-2 rounded-lg opacity-60 py-2 hover:opacity-100 transition-opacity ${className}`}
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
    <nav className="mx-auto mt-10 flex w-full max-w-7xl flex-wrap items-center justify-between gap-8 p-4 font-inter text-sm">
      <div className="flex flex-1 flex-shrink-0 items-center justify-start gap-2">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
            <Image
              alt="Ikiform Logo"
              className="light:invert"
              height={36}
              src="/favicon.ico"
              width={36}
            />
            <span className="text-2xl font-semibold font-dm-sans tracking-tight">Ikiform</span>
          </span>
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <Link 
          href="/" 
          className="text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          Home
        </Link>
        <Link 
          href="/#features" 
          className="text-sm opacity-70 hover:opacity-100 transition-"
        >
          Features
        </Link>
        <Link 
          href="/feedback" 
          className="text-sm opacity-70 hover:opacity-100 transition-"
        >
          Feedback
        </Link>
        <Link 
          href="/#pricing" 
          className="text-sm opacity-70 hover:opacity-100 transition-"
        >
          Pricing
        </Link>
      </div>
      <div className="hidden flex-1 justify-end gap-2 md:flex">
        {user ? (
          <Button asChild variant="secondary" className="rounded-full border border-[0.5px] hover:brightness-99">
            <Link className="flex items-center gap-2 font-medium px-5 py-5" href="/dashboard">
              Dashboard
              <ChevronRight/>
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="rounded-full border border-[0.5px] hover:brightness-99">
            <Link className="flex items-center gap-2 font-medium px-5 py-5" href="/login">
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
                <DrawerNavLink href="/">
                  Home
                </DrawerNavLink>
                <DrawerNavLink href="/#features">
                  Features
                </DrawerNavLink>
                <DrawerNavLink href="/#pricing">
                  Pricing
                </DrawerNavLink>
                <DrawerNavLink href="/feedback">
                  Feedback
                </DrawerNavLink>
              </nav>
              <div className="flex w-full flex-col">
                {user ? (
                  <DrawerNavLink
                    href="/dashboard"
                    icon={<User className="w-4 h-4" />}
                    isButton
                  >
                    Dashboard
                  </DrawerNavLink>
                ) : (
                  <DrawerNavLink
                    href="/login"
                    icon={<LogIn className="w-4 h-4" />}
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
