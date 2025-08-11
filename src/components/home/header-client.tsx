"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AlignJustify, LogIn, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";

interface HeaderClientProps {
  initialUser: SupabaseUser | null;
  mobileOnly?: boolean;
}

/**
 * Minimal client component for interactive header elements
 * Only handles user authentication state and mobile drawer
 */
export function HeaderClient({
  initialUser,
  mobileOnly = false,
}: HeaderClientProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  const currentUser = mounted ? user : initialUser;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mobileOnly) {
    return currentUser ? (
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
    );
  }

  return (
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
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link href="/#features">Features</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link href="/#pricing">Pricing</Link>
              </Button>
            </nav>

            <div className="flex w-full flex-col gap-2">
              {currentUser ? (
                <Button asChild className="w-full justify-start font-medium">
                  <Link href="/dashboard">
                    <User />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full justify-start font-medium">
                  <Link href="/login">
                    <LogIn />
                    Login
                  </Link>
                </Button>
              )}

              <DrawerClose asChild>
                <Button asChild className="w-full justify-start font-medium">
                  <Link href="/f/feedback-form-evtu2f">Feedback</Link>
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
