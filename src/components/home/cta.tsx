"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "../ui";
import { Button } from "../ui/button";

const CtaHeading = React.memo(function CtaHeading() {
	return (
		<div className="flex flex-col gap-6">
			<h2
				className="text-center font-semibold text-4xl leading-tighter tracking-[-2px] md:text-5xl"
				id="cta-title"
			>
				Start Collecting Responses in No Time.
			</h2>
			<p className="text-center text-base text-muted-foreground md:text-lg">
				Get started with Ikiform to build forms, surveys, collect responses, and
				more in seconds!
			</p>
		</div>
	);
});

function PrimaryActions({ user }: { user: unknown }) {
	return (
		<div className="flex w-fit flex-wrap items-center justify-center gap-3">
			{user ? (
				<Button asChild className="rounded-full" variant="default">
					<Link
						className="flex h-11 w-full items-center gap-2 font-medium md:w-44"
						href="/dashboard"
					>
						Go to Dashboard{" "}
						<svg
							aria-hidden="true"
							height="1em"
							viewBox="0 0 24 24"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01"
								fill="currentColor"
							/>
						</svg>
					</Link>
				</Button>
			) : (
				<Button asChild className="rounded-full" variant="default">
					<Link
						className="flex h-11 w-full items-center gap-2 font-medium md:w-62"
						href="/login"
					>
						<span>Start Collecting Responses</span>{" "}
						<ChevronRight aria-hidden="true" />
					</Link>
				</Button>
			)}
			<Button asChild className="rounded-full" variant="outline">
				<Link
					className="flex h-11 w-full items-center gap-2 font-medium md:w-32"
					href="/#form-builder-demo"
				>
					<span>Try a Demo</span>
				</Link>
			</Button>
		</div>
	);
}

export default function CTA() {
	const { user } = useAuth();

	return (
		<section
			aria-labelledby="cta-title"
			className="mx-auto w-full max-w-7xl bg-background"
		>
			<div className="mx-auto flex w-full flex-col">
				<Card className="relative overflow-hidden rounded-none border-t-0 bg-card p-8 py-12 shadow-none md:p-12 md:py-16">
					<CardContent className="flex flex-col items-center gap-8 px-0 py-24 text-center">
						<CtaHeading />
						<PrimaryActions user={user} />
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
