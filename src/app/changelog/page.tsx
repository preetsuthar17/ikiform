import { ChangelogPage } from "@/components/changelog/changelog-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default async function Changelog() {
	return <ChangelogPage locale="en" />;
}
