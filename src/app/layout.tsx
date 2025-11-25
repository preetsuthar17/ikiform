import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { BotIdClientWrapper } from "@/components/other/integrations/bot-id-client";
import { TicketpingController } from "@/components/other/integrations/ticket-ping-controller";
import { LightThemeEnforcer } from "@/components/other/utils/light-theme-enforcer";
import { Toaster } from "@/components/ui/toast";
import ConditionalLayout from "./conditional-layout";

const geist = Geist({
	variable: "--font-sans",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});
const geistMono = Geist_Mono({
	variable: "--font-mono",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Build forms, collect responses & analyze data effortlessly.",
		template: "%s — Ikiform",
	},
	description:
		"Create beautiful forms with Ikiform - Build forms, collect responses & analyze data effortlessly.",
	applicationName: "Ikiform",
	authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
	creator: "Ikiform",
	publisher: "Ikiform",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://www.ikiform.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.ikiform.com",
		siteName: "Ikiform",
		title: "Ikiform",
		description: "Build forms, collect responses & analyze data effortlessly.",
		images: [
			{
				url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
				width: 1200,
				height: 630,
				alt: "Ikiform",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@Ikiform",
		creator: "@Ikiform",
		title: "Ikiform",
		description: "Build forms, collect responses & analyze data effortlessly.",
		images: [
			"https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [{ url: "/favicon.ico" }],
	},
	keywords: [
		"form builder",
		"online forms",
		"surveys",
		"questionnaires",
		"open source",
		"typeform alternative",
		"google forms alternative",
		"form creator",
		"survey tool",
		"data collection",
		"Ikiform",
		"form software",
		"custom forms",
		"interactive forms",
		"form analytics",
	],
	category: "technology",
	classification: "Business Software",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className="light" lang="en" suppressHydrationWarning>
			<head>
				<BotIdClientWrapper />
				<script defer src="https://assets.onedollarstats.com/stonks.js" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
            `,
					}}
				/>
				{process.env.NODE_ENV === "development" && (
					<script
						crossOrigin="anonymous"
						defer
						src="//unpkg.com/react-scan/dist/auto.global.js"
					/>
				)}
				{process.env.NODE_ENV === "development" && (
					<Script
						src="//unpkg.com/react-grab/dist/index.global.js"
						crossOrigin="anonymous"
						strategy="beforeInteractive"
						data-enabled="true"
					/>
				)}
			</head>
			<TicketpingController />
			<body
				className={`light ${geist.className} ${geistMono.variable} antialiased`}
			>
				<LightThemeEnforcer />
				<ConditionalLayout>{children}</ConditionalLayout>
				<Analytics />
				<Toaster position="top-center" />
				<GoogleAnalytics gaId="G-X4CH42084K" />
			</body>
		</html>
	);
}
