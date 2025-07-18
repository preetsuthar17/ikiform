import React from "react";
import { Card } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { WebhookManagementPanel } from "@/components/webhooks/WebhookManagementPanel";

export function WebhooksSettingsSection({ formId }: { formId: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Webhooks</h3>
      </div>
      <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
        <WebhookManagementPanel formId={formId} />
      </div>
    </Card>
  );
}
