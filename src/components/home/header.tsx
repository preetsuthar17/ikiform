"use client";

// External imports
import Image from "next/image";
import Link from "next/link";

// Internal imports
import { Button } from "../ui/button";
import { LogIn, User, AlignJustify } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "../ui/drawer";

// Supabase
import { useAuth } from "@/hooks/use-auth";
import { FaGithub } from "react-icons/fa6";

export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="flex justify-between items-center flex-wrap gap-8 my-10 p-4 text-sm font-inter w-full max-w-[95%] mx-auto">
      <div className="flex-shrink-0 flex items-center gap-2">
        <Link href="/">
          <span className="text-3xl font-semibold tracking-tight flex items-center gap-2 justify-center">
            <Image
              src="/favicon.ico"
              alt="Ikiform Logo"
              width={40}
              height={40}
              className="invert"
            />
            <span>Ikiform</span>
          </span>
        </Link>
      </div>
      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-8">
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/#pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#features">Features</Link>
          </Button>
        </nav>
      </div>
      <div className="hidden sm:flex gap-2">
        {!user ? (
          <Button asChild>
            <Link href="/login" className="flex items-center gap-2 font-medium">
              <LogIn />
              Login
            </Link>
          </Button>
        ) : (
          <Button className="font-medium" size="icon" asChild>
            <Link href="/dashboard">
              <User />
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link
            href="https://github.com/preetsuthar17/Ikiform"
            target="_blank"
            className="flex items-center gap-2 font-medium"
          >
            <FaGithub />
            GitHub
          </Link>
        </Button>
      </div>
      {/* Mobile nav */}
      <div className="sm:hidden flex items-center">
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost">
              <AlignJustify className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6 pt-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4 items-center w-full">
              <nav className="flex flex-col gap-2 w-full">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/#pricing">Pricing</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/#features">Features</Link>
                </Button>
              </nav>
              <div className="flex flex-col gap-2 w-full">
                {!user ? (
                  <Button asChild className="w-full justify-center">
                    <Link
                      href="/login"
                      className="flex items-center gap-2 font-medium"
                    >
                      <LogIn />
                      Login
                    </Link>
                  </Button>
                ) : (
                  <Button className="font-medium w-full justify-center" asChild>
                    <Link href="/dashboard">
                      <User />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full justify-center">
                  <Link
                    href="https://github.com/preetsuthar17/Ikiform"
                    target="_blank"
                    className="flex items-center gap-2 font-medium"
                  >
                    <FaGithub />
                    GitHub
                  </Link>
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full mt-4">
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
