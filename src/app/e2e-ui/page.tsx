import type { Metadata } from "next";
import { UiRegressionHarness } from "./ui-regression-harness";

export const metadata: Metadata = {
	title: "UI Regression Harness",
	robots: {
		index: false,
		follow: false,
	},
};

export default function UiRegressionPage() {
	return (
		<main>
			<UiRegressionHarness />
		</main>
	);
}
