"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { User } from "@supabase/supabase-js";
import { AlignJustify, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
} from "../../ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Skeleton } from "../../ui/skeleton";
import { PRIMARY_LINKS } from "./header";

interface NavLink {
	href: string;
	label: string;
}

interface HeaderClientProps {
	primaryLinks: NavLink[];
}

interface UserAvatarProps {
	user: User;
}

const UserAvatar = React.memo(function UserAvatar({ user }: UserAvatarProps) {
	const nameOrEmail = user.user_metadata?.name ?? user.email ?? "User";
	const avatarUrl = user.user_metadata?.avatar_url ?? undefined;
	const fallback = (nameOrEmail ?? "U").slice(0, 2).toUpperCase();

	return (
		<Avatar className="size-9">
			<AvatarImage alt={nameOrEmail} src={avatarUrl} />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	);
});

UserAvatar.displayName = "UserAvatar";

interface UserDropdownMenuProps {
	user: User;
	signOut: () => Promise<void>;
}

const UserDropdownMenu = React.memo(function UserDropdownMenu({
	user,
	signOut,
}: UserDropdownMenuProps) {
	const name =
		user.user_metadata?.name ?? user.user_metadata?.full_name ?? "Account";
	const email = user.email ?? "";

	const handleSignOut = useCallback(
		async (e: Event) => {
			e.preventDefault();
			try {
				await signOut();
			} catch (error) {
				console.error("Failed to sign out:", error);
			}
		},
		[signOut]
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-expanded={false}
					aria-label="Open user menu"
					className="inline-flex items-center gap-2 rounded-full focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
				<DropdownMenuLabel className="flex items-start gap-3 px-2 py-2">
					<Avatar className="size-9">
						<AvatarImage
							alt={name}
							src={user.user_metadata?.avatar_url ?? undefined}
						/>
						<AvatarFallback>
							{(name ?? "U").slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex min-w-0 flex-col gap-0.5">
						<span className="truncate font-medium">{name}</span>
						<span className="truncate text-xs opacity-70">{email}</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="flex flex-col gap-0.5 py-1">
					<DropdownMenuItem
						className="py-0 font-medium opacity-70 transition-opacity hover:opacity-100"
						onSelect={(e) => e.preventDefault()}
					>
						<Link
							className="flex min-h-[40px] w-full items-center gap-2"
							href="/dashboard"
						>
							<span>Dashboard</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="py-0 font-medium opacity-70 transition-opacity hover:opacity-100"
						onSelect={(e) => e.preventDefault()}
					>
						<Link
							className="flex min-h-[40px] w-full items-center gap-2"
							href="/feedback"
						>
							<span>Feedback</span>
						</Link>
					</DropdownMenuItem>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="min-h-[40px] font-medium text-destructive opacity-70 transition-opacity hover:opacity-100"
					onSelect={handleSignOut}
				>
					<span className="text-destructive">Log out</span>
					<LogOut className="ml-auto size-4 text-destructive" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

UserDropdownMenu.displayName = "UserDropdownMenu";

interface DesktopActionsProps {
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
}

const DesktopActionsSkeleton = React.memo(function DesktopActionsSkeleton() {
	return (
		<div aria-label="Loading" className="hidden items-center gap-2 md:flex">
			<Skeleton className="h-9 w-26" />
			<Skeleton className="size-9 rounded-full" />
		</div>
	);
});

DesktopActionsSkeleton.displayName = "DesktopActionsSkeleton";

const DesktopActions = React.memo(function DesktopActions({
	user,
	loading,
	signOut,
}: DesktopActionsProps) {
	if (loading) {
		return <DesktopActionsSkeleton />;
	}

	return (
		<div className="hidden items-center gap-2 md:flex">
			{user ? (
				<div className="flex items-center gap-2">
					<Button asChild className="rounded-md" variant="outline">
						<Link
							className="flex min-h-[36px] items-center gap-1"
							href="/dashboard"
						>
							Dashboard
						</Link>
					</Button>
					<UserDropdownMenu signOut={signOut} user={user} />
				</div>
			) : (
				<Button asChild className="rounded-md" variant="outline">
					<Link className="flex min-h-[36px] items-center gap-1" href="/login">
						Login
					</Link>
				</Button>
			)}
		</div>
	);
});

DesktopActions.displayName = "DesktopActions";

interface DrawerLinksProps {
	links: NavLink[];
}

const DrawerLinks = React.memo(function DrawerLinks({
	links,
}: DrawerLinksProps) {
	return (
		<nav aria-label="Navigation links" className="flex w-full flex-col">
			{links.map(({ href, label }) => (
				<Link
					className="flex min-h-[44px] items-center justify-between rounded-lg px-3 opacity-70 transition-all duration-200 hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
					href={href}
					key={href}
				>
					<span>{label}</span>
					<ChevronRight aria-hidden="true" className="size-4 opacity-70" />
				</Link>
			))}
		</nav>
	);
});

DrawerLinks.displayName = "DrawerLinks";

interface DrawerProfileSectionProps {
	user: User | null;
	signOut: () => Promise<void>;
}

const DrawerProfileSection = React.memo(function DrawerProfileSection({
	user,
	signOut,
}: DrawerProfileSectionProps) {
	const handleSignOut = useCallback(async () => {
		try {
			await signOut();
		} catch (error) {
			console.error("Failed to sign out:", error);
		}
	}, [signOut]);

	if (!user) return null;

	const name =
		user.user_metadata?.name ?? user.user_metadata?.full_name ?? "Account";
	const email = user.email ?? "";

	return (
		<section aria-label="User profile" className="flex flex-col gap-3">
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
				<div className="flex min-w-0 flex-col">
					<div className="truncate font-semibold text-base">{name}</div>
					<div className="truncate text-sm opacity-70">{email}</div>
				</div>
			</div>
			<div className="grid gap-1">
				<Link
					className="flex min-h-[44px] items-center rounded-lg px-3 opacity-70 transition-all duration-200 hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
					href="/dashboard"
				>
					<span>Dashboard</span>
				</Link>
				<Link
					className="flex min-h-[44px] items-center rounded-lg px-3 opacity-70 transition-all duration-200 hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
					href="/feedback"
				>
					<span>Feedback</span>
				</Link>
			</div>
		</section>
	);
});

DrawerProfileSection.displayName = "DrawerProfileSection";

interface MobileDrawerProps {
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
	primaryLinks: NavLink[];
}

const MobileDrawerButtonSkeleton = React.memo(
	function MobileDrawerButtonSkeleton() {
		return (
			<div
				aria-hidden="true"
				className="h-11 w-full animate-pulse rounded-lg bg-muted"
			/>
		);
	}
);

MobileDrawerButtonSkeleton.displayName = "MobileDrawerButtonSkeleton";

const MobileDrawer = React.memo(function MobileDrawer({
	user,
	loading,
	signOut,
	primaryLinks,
}: MobileDrawerProps) {
	return (
		<div className="flex items-center md:hidden">
			<Drawer>
				<DrawerTrigger asChild>
					<Button
						aria-expanded={false}
						aria-label="Open navigation menu"
						className="min-h-[44px] min-w-[44px] touch-manipulation"
						size="icon"
						variant="ghost"
					>
						<VisuallyHidden>Open menu</VisuallyHidden>
						<AlignJustify aria-hidden="true" className="size-6" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="flex flex-col gap-6 overscroll-contain p-6 pt-0 pb-10">
					<VisuallyHidden>
						<DrawerTitle>Navigation Menu</DrawerTitle>
					</VisuallyHidden>
					<VisuallyHidden>
						<DrawerDescription>
							Main navigation links and user actions for Ikiform.
						</DrawerDescription>
					</VisuallyHidden>
					<div className="flex w-full flex-col gap-6">
						<DrawerProfileSection signOut={signOut} user={user} />
						<div className="grid gap-3">
							{loading ? (
								<MobileDrawerButtonSkeleton />
							) : user ? (
								<Button
									asChild
									className="min-h-[44px] w-full touch-manipulation rounded-lg font-medium text-base"
								>
									<Link href="/dashboard">Dashboard</Link>
								</Button>
							) : (
								<Button
									asChild
									className="min-h-[44px] w-full touch-manipulation rounded-lg font-medium text-base"
								>
									<Link href="/login">Login</Link>
								</Button>
							)}
						</div>
						<Separator />

						<DrawerLinks links={primaryLinks} />

						<Separator />

						<Button
							aria-label="Sign out"
							className={cn(
								"flex min-h-[44px] items-center px-3 text-left transition-all",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
								"bg-destructive/10 text-destructive hover:bg-destructive hover:text-white",
								"active:scale-[0.98]"
							)}
							onClick={signOut}
							type="button"
							variant={"secondary"}
						>
							<span className="font-medium">Log Out</span>
						</Button>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
});

MobileDrawer.displayName = "MobileDrawer";

const PrimaryNavLinks = React.memo(function PrimaryNavLinks() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary navigation"
			className="flex items-center"
			role="list"
		>
			{PRIMARY_LINKS.map(({ href, label }) => {
				const isCurrent =
					href === "/"
						? pathname === "/"
						: pathname?.startsWith(href.replace(/#.*/, ""));
				return (
					<Link
						aria-current={isCurrent ? "page" : undefined}
						className="min-h-[32px] min-w-[32px] rounded-full px-4 py-1.5 text-sm opacity-70 transition-all duration-200 hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
						href={href}
						key={href}
					>
						{label}
					</Link>
				);
			})}
		</nav>
	);
});

PrimaryNavLinks.displayName = "PrimaryNavLinks";

export function HeaderClient({ primaryLinks }: HeaderClientProps) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		const fetchUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user ?? null);
			setLoading(false);
		};

		fetchUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = useCallback(async () => {
		try {
			const supabase = createClient();
			await supabase.auth.signOut();
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Sign out error:", error);
		}
	}, [router]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				const activeElement = document.activeElement as HTMLElement;
				if (
					activeElement?.getAttribute("role") === "dialog" ||
					activeElement?.closest('[role="dialog"]')
				) {
					activeElement?.blur();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<DesktopActions loading={loading} signOut={signOut} user={user} />
			<MobileDrawer
				loading={loading}
				primaryLinks={primaryLinks}
				signOut={signOut}
				user={user}
			/>
		</>
	);
}

HeaderClient.NavLinks = PrimaryNavLinks;
