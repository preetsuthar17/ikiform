import { Suspense } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export default function LocalizedAIBuilderLayout({ children }: LayoutProps) {
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
