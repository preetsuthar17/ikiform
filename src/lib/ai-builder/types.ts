export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  schema?: any;
}

export interface FormSchema {
  id: string;
  schema: any;
  prompt: string;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamedContent: string;
  streamError: string | null;
  showSuggestions: boolean;
  suggestions: { text: string; icon: React.ReactNode }[];
  setInput: (v: string) => void;
  input: string;
  handleSend: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowSuggestions: (v: boolean) => void;
  setStreamedContent: (v: string) => void;
  setStreamError: (v: string | null) => void;
  streamingRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  mounted: boolean;
  theme: string | undefined;
}

export interface PreviewPanelProps {
  forms: FormSchema[];
  activeFormId: string | null;
  setActiveFormId: (id: string) => void;
  router: any;
  setShowJsonModal: (v: boolean) => void;
  activeForm: FormSchema | undefined;
}
