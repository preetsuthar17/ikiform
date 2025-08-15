'use client';

import { AlignJustify, ChevronRight, LogIn, Moon, Sun, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from '../ui/drawer';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useTheme } from 'next-themes';

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

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  function handleToggle() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <Button 
      asChild 
      variant="secondary" 
      className="rounded-full border border-[0.5px] hover:brightness-99 relative overflow-hidden" 
      size="icon" 
      onClick={handleToggle}
    >
      <span className="flex items-center justify-center gap-2 font-medium px-5 py-5 relative">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ 
                x: -40, 
                y: -20,
                rotate: -180,
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0,
                rotate: 0,
                opacity: 1 
              }}
              exit={{ 
                x: 40, 
                y: 20,
                rotate: 180,
                opacity: 0 
              }}
              transition={{ 
                duration: 0.2,
                ease: [0.6, 0, 0.4, 1],
                opacity: { duration: 0.15 }
              }}
              className="absolute"
            >
              <Sun className="h-5 w-5 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ 
                x: 40, 
                y: 20,
                rotate: 180,
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0,
                rotate: 0,
                opacity: 1 
              }}
              exit={{ 
                x: -40, 
                y: -20,
                rotate: -180,
                opacity: 0 
              }}
              transition={{ 
                duration: 0.2,
                ease: [0.6, 0, 0.4, 1],
                opacity: { duration: 0.15 }
              }}
              className="absolute"
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
    <nav className="mx-auto mt-10 flex w-full max-w-7xl p-4 flex-wrap items-center justify-between gap-8 font-inter text-sm">
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
      <div className="hidden flex-1 justify-end gap-1 md:flex">
        <ThemeToggleButton />
        {user ? (
          <Button asChild variant="secondary" className="rounded-full border border-[0.5px] hover:brightness-99">
            <Link className="flex items-center gap-2 font-medium px-5 py-5" href="/dashboard">
              Dashboard
              <ChevronRight />
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
