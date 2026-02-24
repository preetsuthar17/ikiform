import type { Metadata } from "next";
import { LegalMarkdownPage } from "@/components/legal/legal-markdown-page";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default async function Terms() {
	return <LegalMarkdownPage document="terms" locale="en" />;
}
