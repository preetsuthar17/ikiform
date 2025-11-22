import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "AI Form Builder - Create Forms with AI | ikiform",
	description:
		"Create beautiful forms using our AI-powered form builder. Design, customize, and deploy forms in minutes with intelligent assistance.",
	keywords:
		"AI form builder, form creator, form generator, drag and drop forms",
};

interface LayoutProps {
	children: React.ReactNode;
}

export default function AIBuilderLayout({ children }: LayoutProps) {
	return (
		<div className="h-screen overflow-hidden">
			<Suspense
				fallback={
					<div className="flex h-screen w-full items-center justify-center">
						<div className="animate-pulse text-muted-foreground">
							Loading AI Builder...
						</div>
					</div>
				}
			>
				{children}
			</Suspense>
		</div>
	);
}
