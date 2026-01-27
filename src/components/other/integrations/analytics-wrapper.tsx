"use client";

import dynamic from "next/dynamic";

const Analytics = dynamic(
	() => import("@vercel/analytics/next").then((m) => m.Analytics),
	{ ssr: false }
);

const GoogleAnalytics = dynamic(
	() => import("@next/third-parties/google").then((m) => m.GoogleAnalytics),
	{ ssr: false }
);

export function AnalyticsWrapper({ gaId }: { gaId: string }) {
	return (
		<>
			<Analytics />
			<GoogleAnalytics gaId={gaId} />
		</>
	);
}
