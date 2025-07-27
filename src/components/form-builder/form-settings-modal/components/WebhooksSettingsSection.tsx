import { Link2 } from 'lucide-react';
import React from 'react';
import { FaQuestion } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WebhookManagementPanel } from '@/components/webhooks/WebhookManagementPanel';

export function WebhooksSettingsSection({ formId }: { formId: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Link2 className="h-5 w-5 text-primary" />
        <h3 className="flex items-center gap-2 font-medium text-lg ">
          Webhooks
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge size={'sm'} variant={'secondary'}>
                  Beta <FaQuestion size={'10'} />
                </Badge>
                <TooltipContent>
                  this feature is still under testing you may face some bugs.
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </h3>
      </div>
      <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
        <WebhookManagementPanel formId={formId} />
      </div>
    </Card>
  );
}
