import React from "react";
import { Card } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { WebhookManagementPanel } from "@/components/webhooks/WebhookManagementPanel";
import { Badge } from "@/components/ui/badge";
import { FaQuestion } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WebhooksSettingsSection({ formId }: { formId: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Link2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium flex gap-2 items-center ">
          Webhooks
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={"secondary"} size={"sm"}>
                  Beta <FaQuestion size={"10"} />
                </Badge>
                <TooltipContent>
                  this feature is still under testing you may face some bugs.
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </h3>
      </div>
      <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
        <WebhookManagementPanel formId={formId} />
      </div>
    </Card>
  );
}
