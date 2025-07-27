// React imports

// Icon imports
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

// UI components imports
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps {
  schema: any;
}

export function CopyButton({ schema }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="flex items-center gap-2"
            disabled={copied}
            onClick={handleCopy}
            size="icon"
            variant="outline"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4 transition-all" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent size="sm">{copied ? 'Copied' : 'Copy'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
