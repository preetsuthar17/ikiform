'use client';

import { AlignJustify, LogIn, MessageCircleIcon, User } from 'lucide-react';
// External imports
import Image from 'next/image';
import Link from 'next/link';
// Supabase
import { useAuth } from '@/hooks/use-auth';
// Internal imports
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../ui/drawer';

export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="mx-auto mt-10 flex w-full max-w-[95%] flex-wrap items-center justify-between gap-8 p-4 font-inter text-sm">
      <div className="flex flex-shrink-0 items-center gap-2">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
            <Image
              alt="Ikiform Logo"
              className="invert"
              height={40}
              src="/favicon.ico"
              width={40}
            />
            <span>Ikiform</span>
          </span>
        </Link>
      </div>
      {/* Desktop nav */}
      <div className="hidden items-center gap-8 sm:flex">
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#features">Features</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#pricing">Pricing</Link>
          </Button>
        </nav>
      </div>
      <div className="hidden gap-2 sm:flex">
        {user ? (
          <Button asChild className="font-medium" size="icon">
            <Link href="/dashboard">
              <User />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link className="flex items-center gap-2 font-medium" href="/login">
              <LogIn />
              Login
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link
            className="flex items-center gap-2 font-medium"
            href="/forms/de330706-1cdc-494c-9d04-7afef3d3e20b"
          >
            <MessageCircleIcon />
            Feedback
          </Link>
        </Button>
      </div>
      {/* Mobile nav */}
      <div className="flex items-center sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button aria-label="open-sidebar" size="icon" variant="ghost">
              <span className="sr-only">Open sidebar</span>
              <AlignJustify className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex w-full flex-col items-center gap-4">
              <nav className="flex w-full flex-col gap-2">
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Link href="/">Home</Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Link href="/#features">Features</Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Link href="/#pricing">Pricing</Link>
                </Button>
              </nav>
              <div className="flex w-full flex-col gap-2">
                {user ? (
                  <Button asChild className="w-full justify-center font-medium">
                    <Link href="/dashboard">
                      <User />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full justify-center">
                    <Link
                      className="flex items-center gap-2 font-medium"
                      href="/login"
                    >
                      <LogIn />
                      Login
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full justify-center">
                  <Link
                    className="flex items-center gap-2 font-medium"
                    href="/forms/de330706-1cdc-494c-9d04-7afef3d3e20b"
                  >
                    <MessageCircleIcon />
                    Feedback
                  </Link>
                </Button>
              </div>
              <DrawerClose asChild>
                <Button className="mt-4 w-full" variant="outline">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
