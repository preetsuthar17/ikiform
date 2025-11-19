"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AlignJustify, ChevronRight, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AppLogo = React.memo(function AppLogo() {
  return (
    <Link href="/" tabIndex={0}>
      <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
        <Image alt="Ikiform Logo" height={30} src="/favicon.ico" width={30} />
        <span className="font-semibold text-2xl tracking-tight">Ikiform</span>
      </span>
    </Link>
  );
});

const PrimaryNavLinks = React.memo(function PrimaryNavLinks({
  links,
  pathname,
}: {
  links: { href: string; label: string }[];
  pathname: string;
}) {
  return (
    <div className="hidden items-center md:flex">
      {links.map(({ href, label }) => {
        const current =
          href === "/"
            ? pathname === "/"
            : pathname?.startsWith(href.replace(/#.*/, ""));
        return (
          <Link
            aria-current={current ? "page" : undefined}
            className="rounded-full px-4 py-1 text-sm opacity-70 transition-all hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={href}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
});

const UserAvatar = React.memo(function UserAvatar({ user }: { user: any }) {
  const nameOrEmail = user.user_metadata?.name ?? user.email ?? "User";
  const avatarUrl = user.user_metadata?.avatar_url ?? undefined;
  const fallback = (nameOrEmail ?? "U").slice(0, 2).toUpperCase();
  return (
    <Avatar>
      <AvatarImage alt={nameOrEmail} src={avatarUrl} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
});

const UserDropdownMenu = React.memo(function UserDropdownMenu({
  user,
  signOut,
}: {
  user: any;
  signOut: () => Promise<void>;
}) {
  const name =
    user.user_metadata?.name ?? user.user_metadata?.full_name ?? "Account";
  const email = user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open user menu"
          className="inline-flex items-center gap-2 rounded-full text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50"
          size="icon"
          variant="outline"
        >
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-lg p-2 shadow-xs"
        sideOffset={8}
      >
        <DropdownMenuLabel className="mb-2 flex items-start gap-3 px-2 py-2">
          <Avatar className="size-9">
            <AvatarImage
              alt={name}
              src={user.user_metadata?.avatar_url ?? undefined}
            />
            <AvatarFallback>
              {(name ?? "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs opacity-70">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="mt-2 py-0 font-medium opacity-70 hover:opacity-100"
          onSelect={(e) => e.preventDefault()}
        >
          <Link
            className="flex h-10 w-full items-center gap-2"
            href="/dashboard"
          >
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="mb-2 py-0 font-medium opacity-70 hover:opacity-100"
          onSelect={(e) => e.preventDefault()}
        >
          <Link
            className="flex h-10 w-full items-center gap-2"
            href="/feedback"
          >
            <span>Feedback</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="mt-2 h-10 font-medium text-destructive opacity-70 hover:opacity-100"
          onSelect={(e) => {
            e.preventDefault();
            void signOut();
          }}
        >
          <span className="text-destructive">Log out</span>
          <LogOut className="ml-auto size-4 text-destructive" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const DesktopActions = React.memo(function DesktopActions({
  user,
  loading,
  signOut,
}: {
  user?: any;
  loading?: boolean;
  signOut: () => Promise<void>;
}) {
  return (
    <div className="hidden flex-1 justify-end gap-2 md:flex">
      {loading ? (
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="h-9 w-26 animate-pulse rounded-md bg-muted"
          />
          <div
            aria-hidden="true"
            className="h-9 w-10 animate-pulse rounded-full bg-muted"
          />
        </div>
      ) : user ? (
        <div className="flex items-center gap-2">
          <Button asChild className="rounded-md" variant="outline">
            <Link className="flex items-center gap-1" href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <UserDropdownMenu signOut={signOut} user={user} />
        </div>
      ) : (
        <Button asChild className="rounded-md" variant="outline">
          <Link className="flex items-center gap-1" href="/login">
            Login
          </Link>
        </Button>
      )}
    </div>
  );
});

const DrawerLinks = React.memo(function DrawerLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <section className="flex w-ful flex-col">
      {links.map(({ href, label }) => (
        <Link
          className="flex h-11 items-center justify-between rounded-lg opacity-70 transition-opacity hover:opacity-100"
          href={href}
          key={href}
        >
          <span>{label}</span>
          <ChevronRight className="size-4 opacity-70" />
        </Link>
      ))}
    </section>
  );
});

const DrawerProfileSection = React.memo(function DrawerProfileSection({
  user,
  signOut,
}: {
  user: any;
  signOut: () => Promise<void>;
}) {
  if (!user) return null;
  const name =
    user.user_metadata?.name ?? user.user_metadata?.full_name ?? "Account";
  const email = user.email;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-start gap-3">
        <Avatar className="size-9">
          <AvatarImage
            alt={name}
            src={user.user_metadata?.avatar_url ?? undefined}
          />
          <AvatarFallback>
            {(name ?? "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-base">{name}</div>
          <div className="text-sm opacity-70">{email}</div>
        </div>
      </div>
      <div className="grid gap-1">
        <Link
          className="flex h-11 items-center rounded-lg opacity-70 transition-opacity hover:bg-accent hover:opacity-100"
          href="/dashboard"
        >
          <span>Dashboard</span>
        </Link>
        <Link
          className="flex h-11 items-center rounded-lg opacity-70 transition-opacity hover:bg-accent hover:opacity-100"
          href="/feedback"
        >
          <span>Feedback</span>
        </Link>
        <button
          className="flex h-11 items-center rounded-lg text-left text-destructive opacity-70 transition-opacity hover:bg-accent/30 hover:opacity-100"
          onClick={() => void signOut()}
          type="button"
        >
          <span className="text-destructive">Log Out</span>
        </button>
      </div>
    </section>
  );
});

const MobileDrawer = React.memo(function MobileDrawer({
  user,
  signOut,
  primaryLinks,
}: {
  user?: any;
  signOut: () => Promise<void>;
  primaryLinks: { href: string; label: string }[];
}) {
  return (
    <div className="flex items-center md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button aria-label="Open menu" size="icon" variant="ghost">
            <span className="sr-only">Open menu</span>
            <AlignJustify className="size-6" />
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
          <div className="flex w-full flex-col gap-6">
            <div className="grid gap-3">
              {user ? (
                <Button asChild className="h-11 w-full rounded-lg text-base">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild className="h-11 w-full rounded-lg text-base">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>

            <DrawerProfileSection signOut={signOut} user={user} />

            <hr className="-mx-6 border-border" />

            <DrawerLinks links={primaryLinks} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
});

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const primaryLinks = React.useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/#features", label: "Features" },
      { href: "/feedback", label: "Feedback" },
      { href: "/#pricing", label: "Pricing" },
    ],
    []
  );

  return (
    <nav
      aria-label="Primary"
      className="yh mx-auto mt-12 flex w-full max-w-7xl flex-wrap items-center justify-between gap-8 font-inter text-sm"
    >
      <a
        className="sr-only rounded-md bg-background px-3 py-2 shadow-md focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="flex flex-1 flex-shrink-0 items-center justify-start gap-8">
        <AppLogo />
        <PrimaryNavLinks links={primaryLinks} pathname={pathname} />
      </div>
      <DesktopActions loading={loading} signOut={signOut} user={user} />
      <MobileDrawer primaryLinks={primaryLinks} signOut={signOut} user={user} />
    </nav>
  );
}
