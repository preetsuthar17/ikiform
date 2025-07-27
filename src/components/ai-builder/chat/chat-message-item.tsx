// Animation imports
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

// UI components imports
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Local imports
import type { ChatMessage } from '@/lib/ai-builder/types';
import { ExpandableJsonBlock } from './expandable-json-block';

interface ChatMessageItemProps {
  message: ChatMessage;
  index: number;
}

export const ChatMessageItem = memo(function ChatMessageItem({
  message,
  index,
}: ChatMessageItemProps) {
  const contentLines = useMemo(() => {
    if (message.role === 'user') {
      return message.content.split('\n');
    }
    return null;
  }, [message.content, message.role]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      key={index}
    >
      <Card
        className={`max-w-[90%] p-2 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50'
        }`}
      >
        {message.role === 'assistant' && (
          <CardHeader className="p-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-card bg-muted-foreground" />
              <p className="font-medium text-xs">Kiko</p>
            </div>
          </CardHeader>
        )}
        <CardContent className="p-1">
          <div className="flex flex-col gap-2">
            <div className="prose prose-sm max-w-none">
              {message.role === 'user' && contentLines && (
                <div>
                  {contentLines.map((line: string, i: number) => (
                    <p className="text-sm" key={i}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {message.role === 'assistant' && message.schema && (
                <ExpandableJsonBlock schema={message.schema} />
              )}
              {message.role === 'assistant' && !message.schema && (
                <div className="whitespace-pre-wrap break-words text-sm">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
