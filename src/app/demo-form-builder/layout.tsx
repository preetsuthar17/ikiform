import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
	title: {
		default: "Demo Form Builder",
		template: "%s — Ikiform",
	},
	description:
		"Try out the Ikiform Demo Form Builder. Experiment with building, editing, and managing forms in a live, interactive environment.",
	applicationName: "Ikiform",
	authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
	creator: "Ikiform",
	publisher: "Ikiform",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://www.ikiform.com/demo-form-builder"),
	alternates: {
		canonical: "/demo-form-builder",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.ikiform.com/demo-form-builder",
		siteName: "Ikiform",
		title: "Demo Form Builder | Ikiform",
		description:
			"Test and explore Ikiform's Demo Form Builder. Drag-and-drop fields, customize layouts, and see your changes in real time.",
		images: [
			{
				url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
				width: 1200,
				height: 630,
				alt: "Ikiform Demo Form Builder",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@Ikiform",
		creator: "@Ikiform",
		title: "Demo Form Builder | Ikiform",
		description:
			"Experiment with Ikiform's Demo Form Builder. Build and customize forms instantly in a live demo.",
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
		"demo form builder",
		"form builder demo",
		"Ikiform demo",
		"interactive form builder",
		"form customization demo",
		"open source form builder",
		"live form editor",
		"form creation demo",
		"survey builder demo",
		"form management demo",
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

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
