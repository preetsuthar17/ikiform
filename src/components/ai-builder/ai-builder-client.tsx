"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAIBuilder } from "@/hooks/ai-builder/use-ai-builder";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { CHAT_SUGGESTIONS } from "@/lib/ai-builder/constants";
import { ChatPanel } from "./chat/chat-panel";
import { MobileChatDrawerWrapper } from "./drawer/mobile-chat-drawer-wrapper";
import { PremiumGuard } from "./guards/premium-guard";
import { JsonModalWrapper } from "./modals/json-modal-wrapper";
import { PreviewPanel } from "./preview/preview-panel";

export function AIBuilderClient() {
	const t = useTranslations("product.aiBuilder.client");
	const { user, loading: authLoading } = useAuth();

	const router = useRouter();
	const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
	const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(true);
	const errorLiveRegionRef = useRef<HTMLDivElement | null>(null);

	const {
		messages,
		input,
		isLoading,
		forms,
		activeFormId,
		isStreaming,
		streamedContent,
		streamError,
		showJsonModal,
		activeForm,
		messagesEndRef,
		streamingRef,
		setInput,
		setActiveFormId,
		setStreamedContent,
		setStreamError,
		setShowJsonModal,
		handleSend,
		handleUseForm,
		processInitialPrompt,
		scrollToBottom,
		scrollStreamingToBottom,
	} = useAIBuilder();

	const suggestions = useMemo(
		() =>
			CHAT_SUGGESTIONS.map((text) => ({
				text,
				icon: <Sparkles className="size-4" />,
			})),
		[]
	);

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom();
		}
	}, [messages.length, scrollToBottom]);

	useEffect(() => {
		if (isStreaming) {
			scrollStreamingToBottom();
		}
	}, [streamedContent, isStreaming, scrollStreamingToBottom]);

	useEffect(() => {
		if (streamError && errorLiveRegionRef.current) {
			errorLiveRegionRef.current.focus({ preventScroll: true });
		}
	}, [streamError]);

	const chatPanelProps = useMemo(
		() => ({
			messages,
			isLoading,
			isStreaming,
			streamedContent,
			streamError,
			suggestions,
			setInput,
			input,
			handleSend,
			setStreamedContent,
			setStreamError,
			streamingRef,
			messagesEndRef,
			mounted: true,
			showSuggestions,
			setShowSuggestions,
		}),
		[
			messages,
			isLoading,
			isStreaming,
			streamedContent,
			streamError,
			suggestions,
			setInput,
			input,
			handleSend,
			setStreamedContent,
			setStreamError,
			streamingRef,
			messagesEndRef,
			showSuggestions,
			setShowSuggestions,
		]
	);

	return (
		<PremiumGuard
			authLoading={authLoading}
			checking={checking}
			hasPremium={hasPremium}
			user={user}
			useSkeleton
		>
			<div
				className="flex h-screen w-full flex-col gap-4 bg-background motion-reduce:animate-none motion-reduce:transition-none md:flex-row"
				id="main-content"
				role="main"
				tabIndex={-1}
			>
				{}
				<div className="fixed bottom-4 left-1/2 z-50 w-full max-w-[90%] -translate-x-1/2 md:hidden">
					<Button
						aria-controls="mobile-chat-drawer"
						aria-expanded={chatDrawerOpen}
						aria-haspopup="dialog"
						className="w-full rounded-2xl"
						onClick={() => setChatDrawerOpen(true)}
						size="lg"
					>
						{t("createFormWithKiko")}
					</Button>
				</div>

				<div className="hidden h-full w-full md:flex">
					<ResizablePanelGroup className="flex flex-1" orientation="horizontal">
						<ResizablePanel defaultSize={20} minSize={20}>
							<div className="h-full w-full">
								<ChatPanel {...chatPanelProps} />
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize={80}>
							<ScrollArea className="h-full">
								<PreviewPanel
									activeForm={activeForm}
									activeFormId={activeFormId}
									forms={forms}
									router={router}
									setActiveFormId={setActiveFormId}
									setShowJsonModal={setShowJsonModal}
								/>
							</ScrollArea>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>

				{}
				<MobileChatDrawerWrapper
					isOpen={chatDrawerOpen}
					onOpenChange={setChatDrawerOpen}
					{...chatPanelProps}
				/>
				<div className="flex h-full min-h-0 flex-1 flex-col md:hidden">
					<Separator />
					<ScrollArea className="min-h-0 flex-1 pb-20">
						<PreviewPanel
							activeForm={activeForm}
							activeFormId={activeFormId}
							forms={forms}
							router={router}
							setActiveFormId={setActiveFormId}
							setShowJsonModal={setShowJsonModal}
						/>
					</ScrollArea>
				</div>

				<div
					aria-atomic="true"
					aria-live="assertive"
					className="sr-only"
					ref={errorLiveRegionRef}
					tabIndex={-1}
				>
					{streamError ? t("streamError", { error: streamError }) : ""}
				</div>
				<div aria-atomic="true" aria-live="polite" className="sr-only">
					{isStreaming
						? t("generatingResponse")
						: isLoading
							? t("loading")
							: ""}
				</div>

				<JsonModalWrapper
					activeForm={activeForm}
					isOpen={showJsonModal}
					onClose={() => setShowJsonModal(false)}
				/>
			</div>
		</PremiumGuard>
	);
}
