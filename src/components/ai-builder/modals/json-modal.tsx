import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { createHighlighter } from "shiki";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormSchema } from "@/lib/ai-builder/types";

import { CopyButton } from "../utils/copy-button";

interface JsonModalProps {
	isOpen: boolean;
	onClose: () => void;
	activeForm: FormSchema | undefined;
}

export function JsonModal({ isOpen, onClose, activeForm }: JsonModalProps) {
	const t = useTranslations("product.aiBuilder.jsonModal");
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const isLoading = !highlightedCode;

	useEffect(() => {
		if (!activeForm?.schema) return;

		const highlightCode = async () => {
			try {
				const highlighter = await createHighlighter({
					themes: ["github-dark", "github-light"],
					langs: ["json"],
				});

				const jsonString = JSON.stringify(activeForm.schema, null, 2);
				const selectedTheme = "github-light";
				const html = highlighter.codeToHtml(jsonString, {
					lang: "json",
					theme: selectedTheme,
				});

				setHighlightedCode(html);
			} catch (error) {
				console.error("Error highlighting code:", error);

				setHighlightedCode(
					`<pre class="whitespace-pre-wrap break-words">${JSON.stringify(activeForm.schema, null, 2)}</pre>`
				);
			}
		};

		highlightCode();
	}, [activeForm?.schema]);

	if (!activeForm?.schema) return null;

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription className="sr-only">
						{t("description")}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<ScrollArea className="h-[60vh] min-h-[240px] rounded-xl border bg-muted/50 p-4">
						{isLoading ? (
							<div className="text-xs">
								<Skeleton className="h-64 w-full" />
							</div>
						) : (
							<div
								className="font-mono text-xs [&_pre]:m-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-transparent [&_pre]:p-0"
								dangerouslySetInnerHTML={{ __html: highlightedCode }}
							/>
						)}
					</ScrollArea>

					<div className="flex justify-end gap-2">
						<CopyButton schema={activeForm.schema} />
						<Button onClick={onClose} variant="outline">
							{t("close")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
