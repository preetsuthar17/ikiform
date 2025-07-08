"use client";

// External imports
import Image from "next/image";
import Link from "next/link";

// Internal imports
import { Button } from "../ui/button";
import { LogIn, User } from "lucide-react";

// Supabase
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <nav
      className={`flex justify-between items-center flex-wrap gap-8 my-10 p-4 text-sm font-inter max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:justify-center w-full max-w-[95%] mx-auto  `}
    >
      <div className="flex-shrink-0">
        <Link href="/">
          <span
            className={`text-3xl font-semibold tracking-tight flex items-center gap-2 justify-center`}
          >
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
      <div>
        <nav>
          <Button asChild variant={"ghost"}>
            <Link href="/">Pricing</Link>
          </Button>
          <Button asChild variant={"ghost"}>
            <Link href="/">Features</Link>
          </Button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          {!user ? (
            <Button asChild>
              <Link
                href="/login"
                className="flex items-center gap-2 font-medium"
              >
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
        </div>
      </div>
    </nav>
  );
}
