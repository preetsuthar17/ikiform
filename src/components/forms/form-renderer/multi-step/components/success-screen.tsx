import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

import type { FormSchema } from "@/lib/database";

interface SuccessScreenProps {
	schema: FormSchema;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ schema }) => (
	<main className="flex min-h-screen items-center justify-center bg-background py-8">
		<div className="mx-auto flex w-full max-w-lg flex-col gap-6">
			<Card className="p-6 shadow-none">
				<CardContent className="flex flex-col items-center gap-6 p-0">
					<div
						aria-hidden="true"
						className="flex size-16 items-center justify-center rounded-xl bg-accent"
					>
						<svg
							aria-hidden="true"
							className="size-8 text-accent-foreground"
							fill="none"
							focusable="false"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M5 13l4 4L19 7"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
							/>
						</svg>
					</div>
					<h1 className="font-semibold text-3xl text-foreground tracking-tight">
						Thank You!
					</h1>
					<p className="text-center text-base text-muted-foreground">
						{schema.settings.successMessage ||
							"Your form has been submitted successfully."}
					</p>
					{schema.settings.redirectUrl && (
						<p className="pt-1 text-muted-foreground/70 text-sm italic">
							Redirecting you in a moment…
						</p>
					)}
				</CardContent>
			</Card>
			{Boolean(
				schema.settings.branding &&
					(schema.settings.branding as any).showIkiformBranding !== false
			) && (
				<p className="text-center text-muted-foreground text-sm">
					Powered by{" "}
					<span className="font-medium text-foreground underline">Ikiform</span>
				</p>
			)}
		</div>
	</main>
);
