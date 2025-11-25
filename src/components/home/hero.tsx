"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import React, { type CSSProperties, useCallback, useState } from "react";
import DemoFormBuilder from "@/components/form-builder/form-builder/demo-form-builder";
import { Badge, Card } from "../ui";
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
		[iframeHeight, style],
	);

	if (hasError) {
		return (
			<div
				className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
				role="alert"
				aria-live="polite"
			>
				<p className="text-destructive font-medium">
					Unable to load form demo. Please try refreshing the page.
				</p>
				<Button
					onClick={() => {
						setHasError(false);
						window.location.reload();
					}}
					variant="outline"
					size="sm"
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
				referrerPolicy="no-referrer"
				sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
				src="https://www.ikiform.com/forms/24ec3d8d-40ef-4143-b289-4e43c112d80e"
				style={iframeStyle}
				title="Ikiform demo form"
				onError={() => setHasError(true)}
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
				className="flex items-center justify-center gap-2"
				href="https://vercel.com/open-source-program?utm_source=ikiform"
				rel="noopener noreferrer"
				target="_blank"
			>
				Sponsored by
				<span className="flex items-center justify-center" aria-hidden="true">
					<svg
						aria-hidden="true"
						className="size-[13px]"
						strokeLinejoin="round"
						viewBox="0 0 16 16"
					>
						<path
							clipRule="evenodd"
							d="M8 1L16 15H0L8 1Z"
							fill="currentColor"
							fillRule="evenodd"
						/>
					</svg>
					Vercel
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

function HeroCTAs() {
	return (
		<div
			aria-live="polite"
			className="flex w-fit flex-wrap items-center justify-center gap-3"
		>
			<Button
				asChild
				className="rounded-full min-h-[44px] md:min-h-[44px]"
				variant="default"
			>
				<Link
					className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap font-medium md:w-auto md:min-w-[200px]"
					href="/login"
				>
					<span>Start Collecting Responses</span>
					<ChevronRight aria-hidden="true" className="size-4" />
				</Link>
			</Button>
			<Button
				asChild
				className="rounded-full min-h-[44px] md:min-h-[44px]"
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
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onOpenFullscreen();
			}
		},
		[onOpenFullscreen],
	);

	return (
		<button
			aria-label="Open form builder demo in fullscreen (press Enter or Space)"
			className="group relative flex w-full min-h-[44px] cursor-pointer items-center justify-center gap-3 bg-card p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted/30 active:bg-muted/40 md:p-6"
			onClick={onOpenFullscreen}
			onKeyDown={handleKeyDown}
			type="button"
		>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
				<Maximize2 aria-hidden="true" className="size-5 text-foreground" />
				<span className="font-medium text-foreground">
					Click to view fullscreen
				</span>
			</div>
			<div className="pointer-events-none w-full h-[900px] overflow-hidden">
				<DemoFormBuilder />
			</div>
		</button>
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
				</div>

				<Card className="w-full max-w-7xl rounded-none border-b-0 bg-card shadow-none">
					<Tabs className="w-full" defaultValue="form-demo">
						<div className="flex items-center justify-start border-b border-border px-4 py-4 md:px-6">
							<TabsList>
								<TabsTrigger value="form-demo">Form Demo</TabsTrigger>
								<TabsTrigger value="form-builder-demo">
									Form Builder Demo
								</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent
							className="mt-0"
							value="form-demo"
							id="form-builder-demo"
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
