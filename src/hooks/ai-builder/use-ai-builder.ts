import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { AIBuilderService } from "@/lib/ai-builder/ai-service";

import type { ChatMessage, FormSchema } from "@/lib/ai-builder/types";
import {
	checkForDuplicateSchema,
	generateSessionId,
} from "@/lib/ai-builder/utils";

interface AiBuilderState {
	sessionId: string | null;
	messages: ChatMessage[];
	input: string;
	isLoading: boolean;
	forms: FormSchema[];
	activeFormId: string | null;
	isStreaming: boolean;
	streamedContent: string;
	streamError: string | null;
	showJsonModal: boolean;
}

type AiBuilderAction =
	| { type: "SET_SESSION_ID"; payload: string }
	| { type: "ADD_MESSAGE"; payload: ChatMessage }
	| { type: "SET_MESSAGES"; payload: ChatMessage[] }
	| { type: "SET_INPUT"; payload: string }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "ADD_FORM"; payload: FormSchema }
	| { type: "SET_ACTIVE_FORM_ID"; payload: string | null }
	| { type: "SET_STREAMING"; payload: boolean }
	| { type: "SET_STREAMED_CONTENT"; payload: string }
	| { type: "SET_STREAM_ERROR"; payload: string | null }
	| { type: "SET_SHOW_JSON_MODAL"; payload: boolean }
	| { type: "RESET_STREAM_STATE" };

const initialState: AiBuilderState = {
	sessionId: null,
	messages: [],
	input: "",
	isLoading: false,
	forms: [],
	activeFormId: null,
	isStreaming: false,
	streamedContent: "",
	streamError: null,
	showJsonModal: false,
};

function aiBuilderReducer(
	state: AiBuilderState,
	action: AiBuilderAction
): AiBuilderState {
	switch (action.type) {
		case "SET_SESSION_ID":
			return { ...state, sessionId: action.payload };
		case "ADD_MESSAGE":
			return { ...state, messages: [...state.messages, action.payload] };
		case "SET_MESSAGES":
			return { ...state, messages: action.payload };
		case "SET_INPUT":
			return { ...state, input: action.payload };
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		case "ADD_FORM":
			return { ...state, forms: [...state.forms, action.payload] };
		case "SET_ACTIVE_FORM_ID":
			return { ...state, activeFormId: action.payload };
		case "SET_STREAMING":
			return { ...state, isStreaming: action.payload };
		case "SET_STREAMED_CONTENT":
			return { ...state, streamedContent: action.payload };
		case "SET_STREAM_ERROR":
			return { ...state, streamError: action.payload };
		case "SET_SHOW_JSON_MODAL":
			return { ...state, showJsonModal: action.payload };
		case "RESET_STREAM_STATE":
			return { ...state, streamedContent: "", streamError: null };
		default:
			return state;
	}
}

export const useAIBuilder = (initialPrompt?: string) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(aiBuilderReducer, initialState);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const streamingRef = useRef<HTMLDivElement>(null);
	const initialPromptProcessedRef = useRef(false);

	const processInitialPrompt = useCallback(() => {
		if (initialPromptProcessedRef.current) return;

		const urlParams = new URLSearchParams(window.location.search);
		const promptParam = urlParams.get("prompt");
		const sentParam = urlParams.get("sent");

		if (promptParam && sentParam === "true") {
			const decodedPrompt = decodeURIComponent(promptParam);
			dispatch({ type: "SET_INPUT", payload: decodedPrompt });
			initialPromptProcessedRef.current = true;

			setTimeout(() => {
				autoSendPrompt(decodedPrompt);
			}, 100);
		} else if (initialPrompt) {
			dispatch({ type: "SET_INPUT", payload: initialPrompt });
			initialPromptProcessedRef.current = true;

			setTimeout(() => {
				autoSendPrompt(initialPrompt);
			}, 100);
		}
	}, [initialPrompt]);

	useEffect(() => {
		processInitialPrompt();
	}, [processInitialPrompt]);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const scrollStreamingToBottom = useCallback(() => {
		if (state.isStreaming && streamingRef.current) {
			streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
		}
	}, [state.isStreaming]);

	const processAiResponse = useCallback(
		async (promptText: string, currentMessages: ChatMessage[]) => {
			const currentSessionId = state.sessionId || generateSessionId();
			dispatch({ type: "SET_SESSION_ID", payload: currentSessionId });

			dispatch({ type: "SET_LOADING", payload: true });
			dispatch({ type: "SET_STREAMING", payload: true });
			dispatch({ type: "RESET_STREAM_STATE" });

			const { fullText, foundJson } = await AIBuilderService.sendMessage(
				currentMessages,
				currentSessionId,
				(content: string) =>
					dispatch({ type: "SET_STREAMED_CONTENT", payload: content }),
				(error: string) =>
					dispatch({ type: "SET_STREAM_ERROR", payload: error })
			);

			dispatch({ type: "SET_STREAMING", payload: false });
			dispatch({ type: "SET_LOADING", payload: false });

			if (foundJson) {
				const existing = checkForDuplicateSchema(state.forms, foundJson);
				if (existing) {
					dispatch({ type: "SET_ACTIVE_FORM_ID", payload: existing.id });
					dispatch({
						type: "ADD_MESSAGE",
						payload: {
							role: "assistant",
							content:
								"This form already exists. Switched to the existing form.",
							schema: foundJson,
						},
					});
				} else {
					const newId = Date.now().toString();
					const newForm = { id: newId, schema: foundJson, prompt: promptText };
					dispatch({ type: "ADD_FORM", payload: newForm });
					dispatch({ type: "SET_ACTIVE_FORM_ID", payload: newId });
					dispatch({
						type: "ADD_MESSAGE",
						payload: {
							role: "assistant",
							content: fullText,
							schema: foundJson,
						},
					});
				}
				dispatch({ type: "SET_STREAMED_CONTENT", payload: "" });
			} else {
				dispatch({
					type: "SET_STREAM_ERROR",
					payload:
						"Sorry, I couldn't generate a form from your input. Please try rephrasing your request or provide more details!",
				});
			}
		},
		[state.sessionId, state.forms]
	);

	const autoSendPrompt = useCallback(
		async (promptText: string) => {
			if (!promptText.trim()) return;

			const newMessage: ChatMessage = { role: "user", content: promptText };
			dispatch({ type: "ADD_MESSAGE", payload: newMessage });
			await processAiResponse(promptText, [...state.messages, newMessage]);
		},
		[state.messages, processAiResponse]
	);

	const handleSend = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!state.input.trim()) return;

			const currentInput = state.input;
			dispatch({ type: "SET_INPUT", payload: "" });

			const newMessage: ChatMessage = { role: "user", content: currentInput };
			dispatch({ type: "ADD_MESSAGE", payload: newMessage });
			await processAiResponse(currentInput, [...state.messages, newMessage]);
		},
		[state.input, state.messages, processAiResponse]
	);

	const handleUseForm = useCallback(() => {
		const activeForm = state.forms.find((f) => f.id === state.activeFormId);
		if (activeForm?.schema) {
			localStorage.setItem(
				"importedFormSchema",
				JSON.stringify(activeForm.schema)
			);
			router.push("/form-builder");
		}
	}, [state.forms, state.activeFormId, router]);

	const activeForm = useMemo(
		() => state.forms.find((f) => f.id === state.activeFormId),
		[state.forms, state.activeFormId]
	);

	const actions = useMemo(
		() => ({
			setInput: (value: string) =>
				dispatch({ type: "SET_INPUT", payload: value }),
			setActiveFormId: (id: string | null) =>
				dispatch({ type: "SET_ACTIVE_FORM_ID", payload: id }),
			setStreamedContent: (content: string) =>
				dispatch({ type: "SET_STREAMED_CONTENT", payload: content }),
			setStreamError: (error: string | null) =>
				dispatch({ type: "SET_STREAM_ERROR", payload: error }),
			setShowJsonModal: (show: boolean) =>
				dispatch({ type: "SET_SHOW_JSON_MODAL", payload: show }),
		}),
		[]
	);

	return {
		messages: state.messages,
		input: state.input,
		isLoading: state.isLoading,
		forms: state.forms,
		activeFormId: state.activeFormId,
		isStreaming: state.isStreaming,
		streamedContent: state.streamedContent,
		streamError: state.streamError,
		showJsonModal: state.showJsonModal,
		activeForm,

		messagesEndRef,
		streamingRef,

		...actions,
		handleSend,
		handleUseForm,

		processInitialPrompt,
		scrollToBottom,
		scrollStreamingToBottom,
	};
};
