export { AIBuilder } from '@/components/ai-builder';
export { useAIBuilder } from '@/hooks/ai-builder/use-ai-builder';

export { AIBuilderService } from '@/lib/ai-builder/ai-service';

export { CHAT_SUGGESTIONS } from '@/lib/ai-builder/constants';

export type {
  ChatMessage,
  ChatPanelProps,
  FormSchema,
  PreviewPanelProps,
} from '@/lib/ai-builder/types';

export {
  checkForDuplicateSchema,
  extractJsonFromText,
  generateSessionId,
  initializeScrollbarStyles,
} from '@/lib/ai-builder/utils';
