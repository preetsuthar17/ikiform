import { Link2 } from "lucide-react";
import { FaQuestion } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WebhookManagementPanel } from "@/components/webhooks/WebhookManagementPanel";

export function WebhooksSettingsSection({ formId }: { formId: string }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Link2 className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Webhooks</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="cursor-help" size="sm" variant="secondary">
                Beta <FaQuestion size={10} />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This feature is still under testing. You may encounter some
                bugs.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
        <WebhookManagementPanel formId={formId} />
      </div>
    </Card>
  );
}
