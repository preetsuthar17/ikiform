// AI Builder Hooks
export { useAIBuilder } from "@/hooks/ai-builder/use-ai-builder";

// AI Builder Components
export { AIBuilder } from "@/components/ai-builder";

// AI Builder Types
export type {
  ChatMessage,
  FormSchema,
  ChatPanelProps,
  PreviewPanelProps,
} from "@/lib/ai-builder/types";

// AI Builder Services
export { AIBuilderService } from "@/lib/ai-builder/ai-service";

// AI Builder Utils
export {
  generateSessionId,
  extractJsonFromText,
  checkForDuplicateSchema,
  initializeScrollbarStyles,
} from "@/lib/ai-builder/utils";

// AI Builder Constants
export { CHAT_SUGGESTIONS } from "@/lib/ai-builder/constants";
