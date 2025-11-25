"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FormSchema } from "@/lib/database";

interface JsonViewModalProps {
	schema: FormSchema;
	isOpen: boolean;
	onClose: () => void;
}

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = async (): Promise<Highlighter> => {
	if (highlighterInstance) {
		return highlighterInstance;
	}

	if (highlighterPromise) {
		return highlighterPromise;
	}

	highlighterPromise = createHighlighter({
		langs: ["json"],
		themes: ["github-dark", "github-light"],
	}).then((highlighter) => {
		highlighterInstance = highlighter;
		highlighterPromise = null;
		return highlighter;
	});

	return highlighterPromise;
};

export function JsonViewModal({ schema, isOpen, onClose }: JsonViewModalProps) {
	const [copied, setCopied] = useState(false);
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const [isHighlighting, setIsHighlighting] = useState(false);

	const abortControllerRef = useRef<AbortController | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const copyButtonRef = useRef<HTMLButtonElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const prefersReducedMotion = useReducedMotion();

	const jsonString = useMemo(() => {
		try {
			return JSON.stringify(schema, null, 2);
		} catch (error) {
			console.error("Failed to stringify schema:", error);
			return "{}";
		}
	}, [schema]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		const highlightCode = async () => {
			if (abortController.signal.aborted) return;

			setIsHighlighting(true);

			try {
				const highlighter = await getHighlighter();

				if (abortController.signal.aborted) return;

				const selectedTheme = "github-light";

				const highlight = () => {
					if (abortController.signal.aborted) return;

					try {
						const html = highlighter.codeToHtml(jsonString, {
							lang: "json",
							theme: selectedTheme,
						});

						if (!abortController.signal.aborted) {
							setHighlightedCode(html);
						}
					} catch (error) {
						console.error("Failed to highlight code:", error);
						if (!abortController.signal.aborted) {
							setHighlightedCode(`<pre><code>${jsonString}</code></pre>`);
						}
					} finally {
						if (!abortController.signal.aborted) {
							setIsHighlighting(false);
						}
					}
				};

				if ("requestIdleCallback" in window) {
					requestIdleCallback(highlight);
				} else {
					setTimeout(highlight, 0);
				}
			} catch (error) {
				if (!abortController.signal.aborted) {
					console.error("Failed to create highlighter:", error);
					setHighlightedCode(`<pre><code>${jsonString}</code></pre>`);
					setIsHighlighting(false);
				}
			}
		};

		highlightCode();

		return () => {
			abortController.abort();
		};
	}, [jsonString, isOpen]);

	useEffect(
		() => () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		},
		[],
	);

	useEffect(() => {
		if (isOpen) {
			previouslyFocusedRef.current =
				(document.activeElement as HTMLElement) ?? null;
			const id = window.setTimeout(() => {
				copyButtonRef.current?.focus();
			}, 0);
			return () => window.clearTimeout(id);
		}
		previouslyFocusedRef.current?.focus();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", onKeyDown, { passive: true });
		return () =>
			window.removeEventListener("keydown", onKeyDown as EventListener);
	}, [isOpen, onClose]);

	const copyToClipboard = async () => {
		try {
			const { copyToClipboard: robustCopy } = await import(
				"@/lib/utils/clipboard"
			);
			const success = await robustCopy(jsonString, {
				showSuccessToast: true,
				successMessage: "JSON copied to clipboard!",
				showErrorToast: true,
				errorMessage: "Failed to copy JSON",
			});

			if (success) {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		} catch (error) {
			const { toast } = await import("@/hooks/use-toast");
			toast.error("Failed to copy JSON");
		}
	};

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent
				aria-busy={isHighlighting || undefined}
				aria-describedby="json-view-description"
				aria-modal="true"
				className="flex h-[80vh] flex-col gap-4 sm:max-w-4xl"
				ref={contentRef}
				role="dialog"
				style={{
					overscrollBehavior: "contain",
				}}
			>
				<DialogHeader>
					<DialogTitle className="tracking-tight">Form Schema JSON</DialogTitle>
					<DialogDescription id="json-view-description">
						Read-only view of the current form schema. Use the copy button to
						copy JSON.
					</DialogDescription>
				</DialogHeader>

				<div className="relative flex flex-1 flex-col">
					<Tooltip delayDuration={prefersReducedMotion ? 0 : 200}>
						<TooltipTrigger asChild>
							<Button
								aria-label={copied ? "Copied" : "Copy JSON"}
								className="absolute top-3 right-3 z-10 ml-auto size-10 rounded-md p-0 transition-transform focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
								disabled={isHighlighting}
								onBlur={(e) => {
									e.currentTarget.style.transform = copied
										? "scale(1.07)"
										: "scale(1)";
								}}
								onClick={copyToClipboard}
								onPointerDown={(e) => {
									e.currentTarget.style.transform = "scale(0.93)";
								}}
								onPointerUp={(e) => {
									e.currentTarget.style.transform = copied
										? "scale(1.07)"
										: "scale(1)";
								}}
								ref={copyButtonRef}
								style={{
									minWidth: 40,
									minHeight: 40,
									transform: copied ? "scale(1.07)" : "scale(1)",
									transition: copied
										? "transform 0.15s cubic-bezier(0.4,0,0.2,1)"
										: "transform 0.13s cubic-bezier(0.4,0,0.2,1)",
								}}
								type="button"
								variant="outline"
							>
								<span
									aria-hidden
									className="relative inline-flex size-5 items-center justify-center"
								>
									<AnimatePresence initial={false} mode="wait">
										{copied ? (
											<motion.span
												animate={
													prefersReducedMotion
														? { opacity: 1 }
														: { scale: 1, opacity: 1, rotate: 0 }
												}
												className="absolute inset-0 grid place-items-center"
												exit={
													prefersReducedMotion
														? { opacity: 0 }
														: { scale: 0.85, opacity: 0, rotate: 8 }
												}
												initial={
													prefersReducedMotion
														? false
														: { scale: 0.85, opacity: 0, rotate: -8 }
												}
												key="copied"
												transition={
													prefersReducedMotion
														? { duration: 0 }
														: { duration: 0.15, ease: "easeOut" }
												}
											>
												<Check className="size-4" />
											</motion.span>
										) : (
											<motion.span
												animate={
													prefersReducedMotion
														? { opacity: 1 }
														: { scale: 1, opacity: 1, rotate: 0 }
												}
												className="absolute inset-0 grid place-items-center"
												exit={
													prefersReducedMotion
														? { opacity: 0 }
														: { scale: 0.85, opacity: 0, rotate: -8 }
												}
												initial={
													prefersReducedMotion
														? false
														: { scale: 0.85, opacity: 0, rotate: 8 }
												}
												key="copy"
												transition={
													prefersReducedMotion
														? { duration: 0 }
														: { duration: 0.15, ease: "easeOut" }
												}
											>
												<Copy className="size-4" />
											</motion.span>
										)}
									</AnimatePresence>
								</span>
								<span className="sr-only">
									{copied ? "Copied" : "Copy JSON"}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent
							align="center"
							className="font-medium"
							side="left"
							sideOffset={10}
						>
							{copied ? "Copied" : "Copy JSON"}
						</TooltipContent>
					</Tooltip>
					<ScrollArea className="h-[71vh] rounded-2xl border bg-muted/30 text-foreground">
						{isHighlighting ? (
							<div
								aria-live="polite"
								className="h=[71vh] flex items-center justify-center p-4"
								role="status"
							>
								<Loader />
							</div>
						) : (
							<div
								className="[&_pre]:!bg-transparent [&_pre]:!p-0 h-full p-4 font-mono text-sm"
								dangerouslySetInnerHTML={{ __html: highlightedCode }}
							/>
						)}
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
