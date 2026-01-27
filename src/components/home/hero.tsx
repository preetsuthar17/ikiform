"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, Maximize2, Star } from "lucide-react";
import Link from "next/link";
import React, {
	type CSSProperties,
	useCallback,
	useEffect,
	useState,
} from "react";
import DemoFormBuilder from "@/components/form-builder/form-builder/demo-form-builder";
import { Badge, Card } from "../ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface EmbeddedFormProps {
	className?: string;
	style?: CSSProperties;
}

const IFRAME_ORIGIN = "https://www.ikiform.com";
const DEFAULT_IFRAME_HEIGHT = 850;

export const EmbeddedForm = React.memo(function EmbeddedForm({
	className,
	style,
}: EmbeddedFormProps) {
	const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
	const [hasError, setHasError] = useState(false);

	const handleMessage = useCallback((event: MessageEvent) => {
		if (event.origin !== IFRAME_ORIGIN) return;
		if (
			event.data?.type === "resize" &&
			typeof event.data?.height === "number"
		) {
			setIframeHeight(event.data.height);
		}
	}, []);

	React.useEffect(() => {
		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [handleMessage]);

	const iframeStyle = React.useMemo<CSSProperties>(
		() => ({
			width: "100%",
			height: `${iframeHeight}px`,
			border: "1px solid #ffffff",
			borderRadius: "22px",
			display: "block",
			margin: "0 auto",
			...style,
		}),
		[iframeHeight, style]
	);

	if (hasError) {
		return (
			<div
				aria-live="polite"
				className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
				role="alert"
			>
				<p className="font-medium text-destructive">
					Unable to load form demo. Please try refreshing the page.
				</p>
				<Button
					onClick={() => {
						setHasError(false);
						window.location.reload();
					}}
					size="sm"
					variant="outline"
				>
					Reload
				</Button>
			</div>
		);
	}

	return (
		<div className={`flex w-full justify-center ${className || ""}`}>
			<iframe
				allow="clipboard-write; camera; microphone"
				frameBorder="0"
				loading="lazy"
				onError={() => setHasError(true)}
				referrerPolicy="no-referrer"
				sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
				src="https://www.ikiform.com/forms/24ec3d8d-40ef-4143-b289-4e43c112d80e"
				style={iframeStyle}
				title="Ikiform demo form"
			/>
		</div>
	);
});

EmbeddedForm.displayName = "EmbeddedForm";

function SponsoredByBadge() {
	return (
		<Badge className="rounded-full px-3 py-0.5 text-sm" variant="secondary">
			<Link
				aria-label="Sponsored by Vercel (opens in a new tab)"
				className="flex items-center justify-center gap-1"
				href="https://vercel.com/open-source-program?utm_source=ikiform"
				rel="noopener noreferrer"
				target="_blank"
			>
				Sponsored by
				<span aria-hidden="true" className="flex items-center justify-center">
					<svg
						aria-label="Vercel logotype"
						height="12"
						role="img"
						viewBox="0 0 262 52"
						width="55"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M59.8019 52L29.9019 0L0.00190544 52H59.8019ZM89.9593 49.6328L114.947 2.36365H104.139L86.9018 36.6921L69.6647 2.36365H58.8564L83.8442 49.6328H89.9593ZM260.25 2.36365V49.6329H251.302V2.36365H260.25ZM210.442 31.99C210.442 28.3062 211.211 25.0661 212.749 22.2699C214.287 19.4737 216.431 17.321 219.181 15.812C221.93 14.3029 225.146 13.5484 228.828 13.5484C232.09 13.5484 235.026 14.2585 237.636 15.6788C240.245 17.0991 242.319 19.2074 243.857 22.0036C245.395 24.7998 246.187 28.2174 246.234 32.2564V34.3202H219.88C220.066 37.2496 220.928 39.5576 222.466 41.2442C224.051 42.8864 226.171 43.7075 228.828 43.7075C230.505 43.7075 232.043 43.2637 233.441 42.376C234.839 41.4883 235.888 40.2899 236.587 38.7808L245.745 39.4466C244.626 42.7754 242.529 45.4385 239.453 47.4358C236.377 49.4331 232.835 50.4317 228.828 50.4317C225.146 50.4317 221.93 49.6772 219.181 48.1681C216.431 46.6591 214.287 44.5064 212.749 41.7102C211.211 38.914 210.442 35.6739 210.442 31.99ZM237.006 28.6612C236.68 25.7762 235.771 23.668 234.28 22.3365C232.789 20.9606 230.971 20.2726 228.828 20.2726C226.358 20.2726 224.354 21.0049 222.816 22.4696C221.278 23.9343 220.322 25.9982 219.95 28.6612H237.006ZM195.347 22.3365C196.838 23.5348 197.77 25.1993 198.143 27.3297L207.371 26.8637C207.044 24.1562 206.089 21.8039 204.505 19.8066C202.92 17.8093 200.869 16.278 198.353 15.2128C195.883 14.1032 193.157 13.5484 190.174 13.5484C186.492 13.5484 183.277 14.3029 180.527 15.812C177.777 17.321 175.634 19.4737 174.096 22.2699C172.558 25.0661 171.789 28.3062 171.789 31.99C171.789 35.6739 172.558 38.914 174.096 41.7102C175.634 44.5064 177.777 46.6591 180.527 48.1681C183.277 49.6772 186.492 50.4317 190.174 50.4317C193.25 50.4317 196.046 49.8769 198.563 48.7673C201.079 47.6133 203.13 45.9933 204.714 43.9072C206.299 41.8212 207.254 39.38 207.58 36.5838L198.283 36.1844C197.957 38.5367 197.048 40.3565 195.557 41.6436C194.065 42.8864 192.271 43.5078 190.174 43.5078C187.285 43.5078 185.048 42.5091 183.463 40.5118C181.879 38.5145 181.086 35.6739 181.086 31.99C181.086 28.3062 181.879 25.4656 183.463 23.4683C185.048 21.471 187.285 20.4723 190.174 20.4723C192.178 20.4723 193.902 21.0937 195.347 22.3365ZM149.955 14.3457H158.281L158.522 21.1369C159.113 19.2146 159.935 17.7218 160.988 16.6585C162.514 15.1166 164.642 14.3457 167.371 14.3457H170.771V21.6146H167.302C165.359 21.6146 163.763 21.8789 162.514 22.4075C161.311 22.9362 160.386 23.7732 159.739 24.9186C159.137 26.064 158.837 27.5178 158.837 29.2799V49.6328H149.955V14.3457ZM111.548 22.2699C110.01 25.0661 109.241 28.3062 109.241 31.99C109.241 35.6739 110.01 38.914 111.548 41.7102C113.086 44.5064 115.229 46.6591 117.979 48.1681C120.729 49.6772 123.944 50.4317 127.626 50.4317C131.634 50.4317 135.176 49.4331 138.252 47.4358C141.327 45.4385 143.425 42.7754 144.543 39.4466L135.385 38.7808C134.686 40.2899 133.638 41.4883 132.24 42.376C130.842 43.2637 129.304 43.7075 127.626 43.7075C124.97 43.7075 122.849 42.8864 121.265 41.2442C119.727 39.5576 118.865 37.2496 118.678 34.3202H145.032V32.2564C144.986 28.2174 144.194 24.7998 142.656 22.0036C141.118 19.2074 139.044 17.0991 136.434 15.6788C133.824 14.2585 130.888 13.5484 127.626 13.5484C123.944 13.5484 120.729 14.3029 117.979 15.812C115.229 17.321 113.086 19.4737 111.548 22.2699ZM133.079 22.3365C134.57 23.668 135.479 25.7762 135.805 28.6612H118.748C119.121 25.9982 120.076 23.9343 121.614 22.4696C123.152 21.0049 125.156 20.2726 127.626 20.2726C129.77 20.2726 131.587 20.9606 133.079 22.3365Z"
							fill="black"
						/>
					</svg>
				</span>
			</Link>
		</Badge>
	);
}

function HeroHeading() {
	return (
		<h1
			className="text-center font-semibold text-4xl leading-tighter tracking-[-2px] md:text-5xl"
			id="home-hero-title"
		>
			Build Forms, Collect Responses & Analyze.
		</h1>
	);
}

function HeroSubheading() {
	return (
		<p
			className="mx-auto max-w-2xl font-normal text-base leading-loose opacity-70 md:text-lg"
			id="home-hero-desc"
		>
			The open-source forms platform for effortless data collection and
			analysis.
		</p>
	);
}

interface UserStats {
	count: number | null;
	users: Array<{ name: string | null }>;
}

const GRAVATAR_URLS = [
	"https://www.gravatar.com/avatar/820117d4b7a01756fc47e0075f0cb6c01a82691ad3ec3ce9a1f49235d0c672ed?d=404",
	"https://www.gravatar.com/avatar/cb0434f4899c68c4bd364f67403cfba7336d1fd1b8a83e15b529b69c91296248?d=404",
	"https://www.gravatar.com/avatar/529f268c1c943e596df18bc22e4f42af5a2cf69e4f0a411d9412847a10aa8a45?d=404",
	"https://www.gravatar.com/avatar/3a5180d835aca06fe8782f611176f1d6064d8ce7852b1e2844be833e03df4cb9?d=404",
];

function AvatarGroup() {
	const [stats, setStats] = useState<UserStats>({ count: null, users: [] });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch("/api/users/stats");
				const data = await response.json();
				setStats(data);
			} catch {
				setStats({ count: null, users: [] });
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center gap-3">
				<div className="flex -space-x-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							aria-hidden="true"
							className={`size-9 animate-pulse rounded-full border-2 border-background bg-muted ${i > 0 ? "-ml-2" : ""}`}
							key={i}
						/>
					))}
				</div>
				<div
					aria-hidden="true"
					className="h-4 w-20 animate-pulse rounded bg-muted"
				/>
			</div>
		);
	}

	const userCount = stats.count ?? 0;
	const displayUsers = stats.users.slice(0, 4);
	const hasUsers = displayUsers.length > 0;

	if (!hasUsers && userCount === 0) {
		return null;
	}

	const formatUserCount = (count: number) => {
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}k`;
		}
		return count.toString();
	};

	const getInitials = (name: string | null) => {
		if (name) {
			const parts = name.trim().split(/\s+/);
			if (parts.length >= 2) {
				return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
			}
			return name.slice(0, 2).toUpperCase();
		}
		return "U";
	};

	const getAvatarUrl = (index: number) => {
		return GRAVATAR_URLS[index % GRAVATAR_URLS.length];
	};

	const avatarCount = hasUsers
		? displayUsers.length
		: Math.min(4, userCount || 4);

	return (
		<div className="flex flex-wrap items-center justify-center gap-3">
			<div aria-label="User avatars" className="flex -space-x-2" role="group">
				{Array.from({ length: avatarCount }).map((_, index) => {
					const avatarUrl = getAvatarUrl(index);
					const user = hasUsers ? displayUsers[index] : null;
					const displayName = user?.name || "User";

					return (
						<Avatar
							aria-hidden={!user}
							aria-label={user ? `${displayName}'s avatar` : undefined}
							className={`size-9 border-2 border-background ${index > 0 ? "-ml-2" : ""}`}
							key={user ? `${user.name}-${index}` : `avatar-${index}`}
						>
							<AvatarImage alt={displayName} src={avatarUrl} />
							<AvatarFallback className="font-medium text-xs">
								{user ? getInitials(user.name) : "U"}
							</AvatarFallback>
						</Avatar>
					);
				})}
			</div>
			<div className="flex flex-col items-center gap-1 sm:items-start">
				<div
					aria-label="5 out of 5 stars rating"
					className="flex items-center gap-0.5"
				>
					{Array.from({ length: 5 }).map((_, i) => (
						<Star
							aria-hidden="true"
							className="size-4 fill-yellow-400 text-yellow-400"
							key={i}
						/>
					))}
				</div>
				{userCount > 0 && (
					<span className="font-medium text-muted-foreground text-sm tabular-nums">
						<span className="sr-only">Total users: </span> Loved by{" "}
						{formatUserCount(userCount)}+ users
					</span>
				)}
			</div>
		</div>
	);
}

function HeroCTAs() {
	return (
		<div
			aria-live="polite"
			className="flex w-fit flex-wrap items-center justify-center gap-3"
		>
			<Button
				asChild
				className="min-h-[44px] rounded-full md:min-h-[44px]"
				variant="default"
			>
				<Link
					className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap font-medium md:w-auto md:min-w-[240px]"
					href="/login"
				>
					<span>Create Your First Form</span>
					<ChevronRight aria-hidden="true" className="size-4" />
				</Link>
			</Button>
			<Button
				asChild
				className="min-h-[44px] rounded-full md:min-h-[44px]"
				variant="outline"
			>
				<Link
					className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap font-medium md:w-auto md:min-w-[160px]"
					href="/#form-builder-demo"
				>
					<span>Try a Demo</span>
				</Link>
			</Button>
		</div>
	);
}

interface FormBuilderPreviewProps {
	onOpenFullscreen: () => void;
}

function FormBuilderPreview({ onOpenFullscreen }: FormBuilderPreviewProps) {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onOpenFullscreen();
			}
		},
		[onOpenFullscreen]
	);

	return (
		<div
			aria-label="Open form builder demo in fullscreen (press Enter or Space)"
			className="group relative flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-3 bg-card p-4 transition-all hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-muted/40 md:p-6"
			onClick={onOpenFullscreen}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
		>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
				<Maximize2 aria-hidden="true" className="size-5 text-foreground" />
				<span className="font-medium text-foreground">
					Click to view fullscreen
				</span>
			</div>
			<div className="pointer-events-none h-[900px] w-full overflow-hidden">
				<DemoFormBuilder />
			</div>
		</div>
	);
}

export default function Hero() {
	const [isFormBuilderFullscreen, setIsFormBuilderFullscreen] = useState(false);

	const handleOpenFullscreen = useCallback(() => {
		setIsFormBuilderFullscreen(true);
	}, []);

	const handleCloseFullscreen = useCallback((open: boolean) => {
		setIsFormBuilderFullscreen(open);
	}, []);

	return (
		<>
			<section
				aria-labelledby="home-hero-title"
				className="mx-auto flex w-full max-w-7xl flex-col bg-linear-to-t from-10% from-background to-85% to-card"
			>
				<div className="relative z-20 flex h-full grow flex-col items-center gap-8 overflow-hidden border border-b-0 px-4 py-28 text-center md:px-6">
					<SponsoredByBadge />
					<HeroHeading />
					<HeroSubheading />
					<HeroCTAs />
					<AvatarGroup />
				</div>

				<Card className="w-full max-w-7xl rounded-none border-b-0 bg-card shadow-none">
					<Tabs className="w-full" defaultValue="form-demo">
						<div className="flex items-center justify-start border-border border-b px-4 py-4 md:px-6">
							<TabsList>
								<TabsTrigger value="form-demo">Form Demo</TabsTrigger>
								<TabsTrigger value="form-builder-demo">
									Form Builder Demo
								</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent
							className="mt-0"
							id="form-builder-demo"
							value="form-demo"
						>
							<EmbeddedForm className="bg-card" />
						</TabsContent>
						<TabsContent className="mt-0" value="form-builder-demo">
							<FormBuilderPreview onOpenFullscreen={handleOpenFullscreen} />
						</TabsContent>
					</Tabs>
				</Card>
			</section>

			<Dialog
				onOpenChange={handleCloseFullscreen}
				open={isFormBuilderFullscreen}
			>
				<DialogContent
					className="h-[95%] max-w-[95%] rounded-2xl p-0 sm:max-w-[95%]"
					showCloseButton={true}
				>
					<VisuallyHidden>
						<DialogTitle>Form Builder Demo</DialogTitle>
					</VisuallyHidden>
					<DemoFormBuilder />
				</DialogContent>
			</Dialog>
		</>
	);
}
